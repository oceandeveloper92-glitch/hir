const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake');
const dayjs = require('dayjs');
const { PDFDocument } = require('pdf-lib');
const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../fonts/Poppins-Regular.ttf'),
        bold: path.join(__dirname, '../fonts/Poppins-Regular.ttf'),
        italics: path.join(__dirname, '../fonts/Poppins-Regular.ttf'),
        bolditalics: path.join(__dirname, '../fonts/Poppins-Regular.ttf')
    }
};
const { TourEnquiry, Quotation, SiteScene, Vendor } = require('../models');
const htmlToPdfmake = require('html-to-pdfmake');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM('');
const printer = new PdfPrinter(fonts);
const Utility = require('../utils/utiles');

const getPdfData = async (quotationId) => {
    const quotation = await Quotation.findOne({
        where: { id: quotationId },
        include: [{ model: TourEnquiry }]
    });
    if (!quotation) return null;

    quotation.dataValues.accommodationDetails = JSON.parse(quotation.dataValues.accommodationDetails || '[]');
    quotation.dataValues.flightDetails = JSON.parse(quotation.dataValues.flightDetails || '[]');

    if (quotation.dataValues.TourEnquiry) {
        const enq = quotation.dataValues.TourEnquiry;
        if (enq.hotelDetails && typeof enq.hotelDetails === 'string') {
            try { enq.dataValues.hotelDetails = JSON.parse(enq.hotelDetails); } catch(e) { enq.dataValues.hotelDetails = []; }
        }
    }

    if (quotation.dataValues.TourEnquiry && quotation.dataValues.TourEnquiry.vendors) {
        let vendorIds = quotation.dataValues.TourEnquiry.vendors;
        if (typeof vendorIds === 'string') {
            try { vendorIds = JSON.parse(vendorIds); } catch(e){}
        }
        if (Array.isArray(vendorIds) && vendorIds.length > 0) {
            const vendors = await Vendor.findAll({ where: { id: vendorIds } });
            quotation.dataValues.TourEnquiry.dataValues.vendorNames = vendors.map(v => v.name);
        }
    }
    return quotation.dataValues;
};

function hasHtmlContent(html) {
    if (!html) return false;
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length > 0;
}

// pdfmake's stack requires an array — htmlToPdfmake sometimes returns a single object
function toArray(val) {
    if (!val) return [{ text: '' }];
    return Array.isArray(val) ? val : [val];
}

function getBase64FromFile(filePath) {
    try {
        const file = fs.readFileSync(path.join(__dirname, '../assets', filePath));
        return `data:image/png;base64,${file.toString('base64')}`;
    } catch (e) {
        return '';
    }
}

function sectionHeader(title) {
    return {
        headlineLevel: 1,
        table: {
            widths: [8, '*'],
            body: [
                [
                    {
                        text: '',
                        fillColor: '#c9a84c',
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0]
                    },
                    {
                        text: (title || '').toUpperCase(),
                        style: 'sectionHeading',
                        fillColor: '#1a3366',
                        color: '#ffffff',
                        border: [false, false, false, false],
                        margin: [12, 9, 12, 9]
                    }
                ]
            ]
        },
        layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
            paddingLeft: () => 0,
            paddingRight: () => 0
        },
        margin: [0, 0, 0, 14]
    };
}

function processItinerary(htmlStr) {
    if (!htmlStr || htmlStr.trim() === '' || htmlStr === '<p><br></p>') {
        return [{ text: 'No itinerary provided', style: 'bodyText' }];
    }
    const html = Utility.preprocessHtml(htmlStr);
    const converted = htmlToPdfmake(html, {
        window,
        defaultStyles: {
            h1: { fontSize: 14, bold: true, marginBottom: 8 },
            h2: { fontSize: 14, bold: true, marginBottom: 8 },
            h3: { fontSize: 14, bold: true, marginBottom: 8 },
            h4: { fontSize: 14, bold: true, marginBottom: 8 },
            p: { marginBottom: 12, fontSize: 11, lineHeight: 1.5, color: '#333' },
            ul: { marginBottom: 25, margin: [18, 0, 0, 0] },
            li: { marginBottom: 6, lineHeight: 1.6 }
        }
    });

    const injectStyles = (items) => {
        if (!Array.isArray(items)) return;
        items.forEach(item => {
            if (item.text && item.style === 'h3') {
                item.margin = [0, 0, 0, 8];
            }
            if (item.stack || item.ul || item.ol) {
                injectStyles(item.stack || item.ul || item.ol);
            }
        });
    };
    const result = toArray(converted);
    injectStyles(result);

    return result;
}

async function mergeWithLetterhead(pdfBuffer, startPageCount, endPageCount = 0) {
    const letterheadPath = path.join(__dirname, '../assets/Hir_International_LLP_Letterhead.pdf');
    const letterheadBytes = fs.readFileSync(letterheadPath);

    const letterheadPdf = await PDFDocument.load(letterheadBytes);
    const contentPdf = await PDFDocument.load(pdfBuffer);
    const outputPdf = await PDFDocument.create();

    const totalPages = contentPdf.getPageCount();
    const pageIndices = Array.from({ length: totalPages }, (_, i) => i);

    const embeddedContentPages = await outputPdf.embedPdf(contentPdf, pageIndices);
    const [embeddedLetterhead] = await outputPdf.embedPdf(letterheadPdf, [0]);

    for (let i = 0; i < totalPages; i++) {
        const contentPage = contentPdf.getPages()[i];
        const { width, height } = contentPage.getSize();

        const newPage = outputPdf.addPage([width, height]);

        const isLeadingImagePage = i < startPageCount;
        const isTrailingImagePage = endPageCount > 0 && i >= totalPages - endPageCount;

        if (!isLeadingImagePage && !isTrailingImagePage) {
            // Draw letterhead as background only on content pages
            newPage.drawPage(embeddedLetterhead, { x: 0, y: 0, width, height });
        }

        // Draw pdfmake content on top
        newPage.drawPage(embeddedContentPages[i], { x: 0, y: 0, width, height });
    }

    return Buffer.from(await outputPdf.save());
}

async function generatePdf(quotationId) {
    const data = await getPdfData(quotationId);
    if (!data) throw new Error("Quotation not found");

    const Enquiry = data.TourEnquiry || {};

    let content = [];
    let startPageCount = 0;

    // 1. Cover (1.png) — page 1
    const coverImage = getBase64FromFile('1.png');
    if (coverImage) {
        content.push({
            image: coverImage,
            width: 595,
            height: 842,
            absolutePosition: { x: 0, y: 0 }
        });
        content.push({ text: '', pageBreak: 'after' });
        startPageCount++;
    }

    // 2. About Us (2.png) — page 2
    const aboutImage = getBase64FromFile('2.png');
    if (aboutImage) {
        content.push({
            image: aboutImage,
            width: 595,
            height: 842,
            absolutePosition: { x: 0, y: 0 }
        });
        content.push({ text: '', pageBreak: 'after' });
        startPageCount++;
    }

    // 2. Trip Overview (2-column layout)
    content.push(sectionHeader('TRIP OVERVIEW'));

    const buildOverviewCard = (headerText, rows) => {
        const body = [
            [
                {
                    text: headerText,
                    colSpan: 2,
                    fillColor: '#1a3366',
                    color: '#ffffff',
                    bold: true,
                    fontSize: 10,
                    border: [false, false, false, false],
                    margin: [10, 7, 10, 7],
                    alignment: 'left'
                },
                {}
            ],
            ...rows.map(([label, value], idx) => [
                {
                    text: label,
                    style: 'labelStyle',
                    fillColor: idx % 2 === 0 ? '#f7f9fc' : '#ffffff',
                    border: [false, false, false, false],
                    margin: [10, 5, 4, 5]
                },
                {
                    text: value,
                    style: 'valueStyle',
                    fillColor: idx % 2 === 0 ? '#f7f9fc' : '#ffffff',
                    border: [false, false, false, false],
                    margin: [4, 5, 10, 5]
                }
            ])
        ];
        return {
            table: {
                widths: ['45%', '55%'],
                body
            },
            layout: {
                hLineWidth: () => 0,
                vLineWidth: () => 0,
                paddingTop: () => 0,
                paddingBottom: () => 0,
                paddingLeft: () => 0,
                paddingRight: () => 0
            }
        };
    };

    const leftCard = buildOverviewCard('CLIENT DETAILS', [
        ['Client Name', Enquiry.name || 'N/A'],
        ['Phone', Enquiry.contactNumber || 'N/A'],
        ['Email', Enquiry.email || 'N/A'],
        ['Enquiry No', (Enquiry.EnquiryNo || 'N/A').toUpperCase()],
        ['Reference By', Enquiry.referenceBy || 'N/A'],
        ['Pickup Location', Enquiry.pickupLocation || 'N/A'],
        ['Drop Location', Enquiry.dropLocation || 'N/A'],
        ['Vehicle', Enquiry.vehicleChoice || 'N/A']
    ]);

    const rightCard = buildOverviewCard('TRIP DETAILS', [
        ['Destination', Enquiry.tourType === 'Domestic' ? (Enquiry.state || 'N/A') : (Enquiry.country || 'N/A')],
        ['Tour Type', Enquiry.tourType || 'N/A'],
        ['Duration', `${Enquiry.noOfNights || 0} Nights / ${(Enquiry.noOfNights || 0) + 1} Days`],
        ['Travel Dates', `${Enquiry.pickupDate ? dayjs(Enquiry.pickupDate).format('DD/MM/YYYY') : 'N/A'} – ${Enquiry.dropDate ? dayjs(Enquiry.dropDate).format('DD/MM/YYYY') : 'N/A'}`],
        ['Adults / Rooms', `${Enquiry.noOfAdults || 0} Adults  |  ${Enquiry.noOfRooms || 1} Rooms`],
        ['Children', `Extra Bed: ${Enquiry.noOfChildsWithExtraBed || 0}  |  No Bed: ${Enquiry.noOfChildsWithoutExtraBed || 0}  |  Below 5: ${Enquiry.noOfChildsBelow5 || 0}`],
        ['Meal Plan', Enquiry.mealPlan || 'N/A']
    ]);

    content.push({
        columns: [
            { width: '*', stack: [leftCard] },
            { width: 16, text: '' },
            { width: '*', stack: [rightCard] }
        ],
        margin: [0, 0, 0, 22],
        unbreakable: true
    });

    // 3-4. Accommodation + Rate Per Person (combined)
    const hasQuotationAccommodation = data.accommodationDetails &&
        Object.keys(data.accommodationDetails).length > 0 &&
        Object.values(data.accommodationDetails).some(tab => (tab.rows && tab.rows.length > 0) || tab.adults || tab.extraAdults || tab.childWithBed || tab.childWithoutBed || tab.childsBelow5);

    const enquiryHotelDetails = Array.isArray(Enquiry.hotelDetails)
        ? Enquiry.hotelDetails
        : (Enquiry.dataValues && Array.isArray(Enquiry.dataValues.hotelDetails) ? Enquiry.dataValues.hotelDetails : []);

    const premiumTableLayout = {
        fillColor: (rowIndex) => rowIndex === 0 ? '#1a3366' : (rowIndex % 2 === 0 ? '#f0f4f9' : '#ffffff'),
        hLineColor: () => '#d0d8e4',
        vLineColor: () => '#d0d8e4',
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 6,
        paddingBottom: () => 6
    };

    const optionLabelBadge = (label) => ({
        table: { widths: ['auto'], body: [[ { text: label, fontSize: 9, bold: true, color: '#ffffff', fillColor: '#1a3366', border: [false,false,false,false], margin: [10,4,10,4] } ]] },
        layout: { hLineWidth:()=>0, vLineWidth:()=>0, paddingTop:()=>0, paddingBottom:()=>0, paddingLeft:()=>0, paddingRight:()=>0 },
        margin: [0, 0, 0, 6]
    });

    if (hasQuotationAccommodation) {
        const accEntries = Object.entries(data.accommodationDetails);
        accEntries.forEach(([key, tab], optIdx) => {
            // Each option starts on a new page
            content.push({ text: '', pageBreak: 'after' });
            if (optIdx === 0) content.push(sectionHeader('ACCOMMODATION'));

            // Option label
            content.push(optionLabelBadge(`OPTION ${optIdx + 1} ACCOMMODATION`));

            // Accommodation table
            if (tab.rows && tab.rows.length > 0) {
                let body = [
                    [
                        { text: 'City', style: 'tableHeaderStyle', alignment: 'left' },
                        { text: 'Hotel Name', style: 'tableHeaderStyle', alignment: 'left' },
                        { text: 'Check In', style: 'tableHeaderStyle' },
                        { text: 'Check Out', style: 'tableHeaderStyle' },
                        { text: 'Room Category', style: 'tableHeaderStyle' },
                        { text: 'Rooms', style: 'tableHeaderStyle' }
                    ]
                ];
                for (const row of tab.rows) {
                    body.push([
                        { text: row.destination || '-', style: 'tableTextStyle', alignment: 'left' },
                        { text: row.hotelName || '-', style: 'tableTextStyle', alignment: 'left' },
                        { text: row.checkIn ? dayjs(row.checkIn).format('DD/MM/YYYY') : '-', style: 'tableTextStyle' },
                        { text: row.checkOut ? dayjs(row.checkOut).format('DD/MM/YYYY') : '-', style: 'tableTextStyle' },
                        { text: row.roomCategory || '-', style: 'tableTextStyle' },
                        { text: row.noOfRooms || '-', style: 'tableTextStyle' }
                    ]);
                }
                content.push({
                    table: { widths: ['12%', '24%', '17%', '17%', '18%', '12%'], body },
                    layout: premiumTableLayout,
                    margin: [0, 0, 0, 10]
                });
            }

            // Rate per person table below this option's accommodation
            const hasRates = tab.adults || tab.extraAdults || tab.childWithBed || tab.childWithoutBed || tab.childsBelow5;
            if (hasRates) {
                content.push({ text: 'Rate Per Person', bold: true, fontSize: 10, color: '#1a3366', margin: [0, 4, 0, 6] });
                content.push({
                    table: {
                        widths: ['*', '*', '*', '*', '*'],
                        body: [
                            [
                                { text: 'Adults', style: 'tableHeaderStyle' },
                                { text: 'Extra Adult', style: 'tableHeaderStyle' },
                                { text: 'Child With Bed', style: 'tableHeaderStyle' },
                                { text: 'Child Without Bed', style: 'tableHeaderStyle' },
                                { text: 'Child Below 5', style: 'tableHeaderStyle' }
                            ],
                            [
                                { text: tab.adults || '-', style: 'tableTextStyle' },
                                { text: tab.extraAdults || '-', style: 'tableTextStyle' },
                                { text: tab.childWithBed || '-', style: 'tableTextStyle' },
                                { text: tab.childWithoutBed || '-', style: 'tableTextStyle' },
                                { text: tab.childsBelow5 || '-', style: 'tableTextStyle' }
                            ]
                        ]
                    },
                    layout: {
                        fillColor: (i) => i === 0 ? '#1a3366' : '#f0f4f9',
                        hLineColor: () => '#d0d8e4', vLineColor: () => '#d0d8e4',
                        hLineWidth: () => 1, vLineWidth: () => 1,
                        paddingLeft: () => 6, paddingRight: () => 6, paddingTop: () => 6, paddingBottom: () => 6
                    },
                    margin: [0, 0, 0, 4],
                    unbreakable: true
                });
                content.push({
                    text: 'Rates are in INR.  Rates are subject to change at the time of booking.',
                    fontSize: 9, italics: true, color: '#888', margin: [2, 0, 0, 6]
                });
            }

            // Remarks
            if (tab.remarks) {
                content.push({ text: `Remarks: ${tab.remarks}`, fontSize: 9, color: '#555', italics: true, margin: [0, 0, 0, 6] });
            }
        });
    } else if (enquiryHotelDetails.length > 0) {
        content.push(sectionHeader('ACCOMMODATION'));
        let body = [
            [
                { text: 'City', style: 'tableHeaderStyle', alignment: 'left' },
                { text: 'Check In', style: 'tableHeaderStyle' },
                { text: 'Check Out', style: 'tableHeaderStyle' },
                { text: 'Nights', style: 'tableHeaderStyle' },
                { text: 'Category', style: 'tableHeaderStyle' }
            ]
        ];
        for (const hotel of enquiryHotelDetails) {
            body.push([
                { text: hotel.city || '-', style: 'tableTextStyle', alignment: 'left' },
                { text: hotel.checkIn ? dayjs(hotel.checkIn).format('DD/MM/YYYY') : '-', style: 'tableTextStyle' },
                { text: hotel.checkOut ? dayjs(hotel.checkOut).format('DD/MM/YYYY') : '-', style: 'tableTextStyle' },
                { text: hotel.nights ? String(hotel.nights) : '-', style: 'tableTextStyle' },
                { text: hotel.hotelCategory || '-', style: 'tableTextStyle' }
            ]);
        }
        content.push({
            table: { widths: ['30%', '17%', '17%', '13%', '23%'], body },
            layout: premiumTableLayout,
            margin: [0, 0, 0, 20]
        });
    }

    const htmlOpts = {
        window,
        defaultStyles: { ul: { margin: [18, 0, 0, 0] }, li: { marginBottom: 6, lineHeight: 1.6, fontSize: 11 }, p: { fontSize: 11 } }
    };

    // 5. Itinerary
    if (hasHtmlContent(data.itinerary)) {
        content.push({ text: '', pageBreak: 'after' });
        content.push(sectionHeader('ITINERARY'));
        content.push({
            stack: toArray(htmlToPdfmake(data.itinerary, htmlOpts)),
            margin: [0, 0, 0, 25]
        });
    }

    // 6. Flight Details
    const flightEntries = data.flightDetails
        ? (Array.isArray(data.flightDetails) ? data.flightDetails.map((tab, i) => [i, tab]) : Object.entries(data.flightDetails))
        : [];
    const validFlightEntries = flightEntries.filter(([, tab]) => tab.rows && tab.rows.length > 0);
    if (validFlightEntries.length > 0) {
        content.push({ text: '', pageBreak: 'after' });
        content.push(sectionHeader('FLIGHT DETAILS'));
        validFlightEntries.forEach(([key, tab], optIdx) => {
            content.push(optionLabelBadge(`OPTION ${optIdx + 1} FLIGHT`));
            let body = [
                [
                    { text: 'Journey Date', style: 'tableHeaderStyle' },
                    { text: 'Flight No', style: 'tableHeaderStyle' },
                    { text: 'Dep. Time', style: 'tableHeaderStyle' },
                    { text: 'Arr. Time', style: 'tableHeaderStyle' },
                    { text: 'Passenger', style: 'tableHeaderStyle' },
                    { text: 'Baggage', style: 'tableHeaderStyle' }
                ]
            ];
            for (const row of tab.rows) {
                body.push([
                    { text: row.travelDate ? dayjs(row.travelDate).format('DD/MM/YYYY') : '-', style: 'tableTextStyle' },
                    { text: row.flightNo || '-', style: 'tableTextStyle' },
                    { text: row.departureTime || '-', style: 'tableTextStyle' },
                    { text: row.arrivalTime || '-', style: 'tableTextStyle' },
                    { text: row.passenger || '-', style: 'tableTextStyle' },
                    { text: row.baggage ? `${row.baggage} KG` : '-', style: 'tableTextStyle' }
                ]);
            }
            content.push({
                table: { widths: ['18%', '16%', '14%', '14%', '20%', '18%'], body },
                layout: premiumTableLayout,
                margin: [0, 0, 0, 8]
            });
            // Rate per person and remarks
            const rateRemarks = [];
            if (tab.ratePerPerson) rateRemarks.push({ text: `Rate per Person: ₹${tab.ratePerPerson}`, bold: true, fontSize: 10, color: '#1a3366', margin: [0, 0, 0, 4] });
            if (tab.remarks) rateRemarks.push({ text: `Remarks: ${tab.remarks}`, fontSize: 9, color: '#555555', italics: true });
            if (rateRemarks.length > 0) content.push({ stack: rateRemarks, margin: [0, 0, 0, 20] });
        });
    }

    // 7. Cities To Visit
    if (Enquiry.EnquiryNo) {
        const sightScenesData = await Utility.converSightSceeningToArray(Enquiry.EnquiryNo);
        if (sightScenesData && Object.keys(sightScenesData).length > 0) {
            content.push(sectionHeader('CITIES TO VISIT'));

            const places = Object.entries(sightScenesData);
            let leftScenes = [], rightScenes = [];

            places.forEach(([place, scenes], i) => {
                const cityLabel = {
                    table: {
                        widths: [4, '*'],
                        body: [[
                            {
                                text: '',
                                fillColor: '#c9a84c',
                                border: [false, false, false, false],
                                margin: [0, 0, 0, 0]
                            },
                            {
                                text: place,
                                style: 'subHeading',
                                border: [false, false, false, false],
                                fillColor: '#eef2f8',
                                margin: [8, 5, 8, 5]
                            }
                        ]]
                    },
                    layout: {
                        hLineWidth: () => 0,
                        vLineWidth: () => 0,
                        paddingTop: () => 0,
                        paddingBottom: () => 0,
                        paddingLeft: () => 0,
                        paddingRight: () => 0
                    },
                    margin: [0, 0, 0, 6]
                };

                let block = [ cityLabel ];
                if (Array.isArray(scenes)) {
                    scenes.forEach(s => block.push({ text: `\u2022  ${s}`, style: 'bodyText', margin: [14, 2, 0, 2] }));
                }
                block.push({ text: '', margin: [0, 0, 0, 14] });

                if (i % 2 === 0) leftScenes.push({ stack: block, unbreakable: true });
                else rightScenes.push({ stack: block, unbreakable: true });
            });

            content.push({
                columns: [
                    { width: '*', stack: leftScenes },
                    { width: '*', stack: rightScenes }
                ],
                columnGap: 20,
                margin: [0, 0, 0, 20]
            });
        }
    }

    // 8. Vendors — removed from PDF output

    // 9. Visa Exclusion
    if (hasHtmlContent(data.visaExclusions)) {
        content.push(sectionHeader('VISA EXCLUSION'));
        content.push({ stack: toArray(htmlToPdfmake(data.visaExclusions, htmlOpts)), margin: [0, 0, 0, 20] });
    }

    // 10. Inclusions — Quotation first, fallback to TourEnquiry
    const inclusionsHtml = hasHtmlContent(data.inclusions) ? data.inclusions : (hasHtmlContent(Enquiry.inclusions) ? Enquiry.inclusions : '');
    if (inclusionsHtml) {
        content.push(sectionHeader('INCLUSIONS'));
        content.push({ stack: toArray(htmlToPdfmake(inclusionsHtml, htmlOpts)), margin: [0, 0, 0, 20] });
    }

    // 11. Exclusions
    const exclusionsHtml = hasHtmlContent(data.exclusions) ? data.exclusions : '';
    if (exclusionsHtml) {
        content.push(sectionHeader('EXCLUSIONS'));
        content.push({ stack: toArray(htmlToPdfmake(exclusionsHtml, htmlOpts)), margin: [0, 0, 0, 20] });
    }

    // 12. Remarks / Notes — removed from PDF output

    // 13. Revision Notes
    if (hasHtmlContent(Enquiry.revisionNotes)) {
        content.push(sectionHeader('REVISION NOTES'));
        content.push({ stack: toArray(htmlToPdfmake(Enquiry.revisionNotes, htmlOpts)), margin: [0, 0, 0, 20] });
    }

    // 12. Trailing image pages based on tour type
    const isDomestic = (Enquiry.tourType || '').toLowerCase() === 'domestic';

    const trailingImageFiles = [
        isDomestic ? '9_domestic.png' : '9_international.png',
        '10.png',
        '11.png',
        '12.png',
        isDomestic ? '16_domestic.png' : '16_international.png'
    ];

    let trailingPageCount = 0;
    for (const imgFile of trailingImageFiles) {
        const img = getBase64FromFile(imgFile);
        if (img) {
            content.push({ text: '', pageBreak: 'after' });
            content.push({
                image: img,
                width: 595,
                height: 842,
                absolutePosition: { x: 0, y: 0 }
            });
            trailingPageCount++;
        }
    }

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [35, 110, 35, 155],
        pageBreakBefore: function(currentNode, followingNodesOnPage) {
            // Only push section headers to next page if very close to bottom (prevents orphaned headers near footer)
            return currentNode.headlineLevel === 1 && followingNodesOnPage.length <= 3;
        },
        content: content,
        defaultStyle: {
            fontSize: 11,
            lineHeight: 1.5,
            color: '#333'
        },
        styles: {
            sectionHeading: {
                fontSize: 13,
                bold: true,
                color: '#ffffff'
            },
            subHeading: {
                fontSize: 12,
                bold: true,
                color: '#1a3366'
            },
            bodyText: {
                fontSize: 11,
                lineHeight: 1.5,
                color: '#333'
            },
            tableHeaderStyle: {
                fontSize: 10,
                bold: true,
                color: '#ffffff',
                alignment: 'center',
                margin: [4, 8, 4, 8]
            },
            tableTextStyle: {
                fontSize: 10,
                alignment: 'center',
                color: '#444',
                margin: [4, 7, 4, 7]
            },
            labelStyle: {
                fontSize: 9.5,
                bold: true,
                color: '#1a3366'
            },
            valueStyle: {
                fontSize: 10,
                color: '#333'
            }
        }
    };

    const pdfBuffer = await new Promise((resolve, reject) => {
        try {
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            let chunks = [];
            pdfDoc.on('data', (chunk) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        } catch (error) {
            reject(error);
        }
    });

    return mergeWithLetterhead(pdfBuffer, startPageCount, trailingPageCount);
}

module.exports = { generatePdf };
