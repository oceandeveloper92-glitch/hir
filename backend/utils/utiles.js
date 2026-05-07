
const dayjs = require('dayjs');
const cheerio = require('cheerio');
const { SiteScene, TourEnquiry } = require('../models');

const Utility = {
    convertDateToDMY(date) {
        return dayjs(date).format('DD/MM/YYYY');
    },

    parseSightSeeings(sightseeingString) {
        if (typeof sightseeingString === 'string') {
            sightseeingString = JSON.parse(sightseeingString);
        }
    },
    preprocessHtml(html) {
        const $ = cheerio.load(html);

        // Convert only H1 into <h3> (for Day headings)
        $('h1').each((i, el) => {
            const content = $(el).text().trim();
            $(el).replaceWith(`<h3 class="dayHeading">${content}</h3>`);
        });

        // Convert H2, H3, etc. into <p> (for descriptions)
        $('h2,h4,h5').each((i, el) => {
            const content = $(el).text().trim();
            $(el).replaceWith(`<p class="dayDescription">${content}</p>`);
        });

        return $.html();
    },
    forceTextColorWhite(contentArray) {
        if (!Array.isArray(contentArray)) return;

        for (const item of contentArray) {
            if (!item.style || typeof item.style !== 'object') {
                item.style = {};
            }

            item.style.color = 'white'; // force white

            // Recursively process substructures
            if (item.stack) forceTextColorWhite(item.stack);
            if (item.ul) forceTextColorWhite(item.ul);
            if (item.ol) forceTextColorWhite(item.ol);
            if (item.columns) forceTextColorWhite(item.columns);
            if (item.table?.body) {
                for (const row of item.table.body) {
                    forceTextColorWhite(row);
                }
            }
        }
    },
    async converSightSceeningToArray(EnquiryNo) {
        const tourData = await TourEnquiry.findOne({
            where: { EnquiryNo },
            attributes: ['siteScenes']
        })
        let sightseeing = tourData.dataValues.siteScenes
        if (typeof sightseeing === 'string') {
            sightseeing = JSON.parse(sightseeing);
        }
        const scenes = sightseeing
            .filter(scene => typeof scene === 'string' && scene.includes('__'))
            .map(scene => {
                const [id, name] = scene.split('__');
                return { id, name };
            });

        // Step 2: Group by id
        const groupedById = scenes.reduce((acc, scene) => {
            if (!acc[scene.id]) acc[scene.id] = [];
            acc[scene.id].push(scene.name);
            return acc;
        }, {});

        // Step 3: Fetch siteScene names from DB
        const siteSceneIds = Object.keys(groupedById);
        const siteScenes = await SiteScene.findAll({
            where: { id: siteSceneIds },
            attributes: ['id', 'name'] // make sure your model has `name`
        });
        const idNameMap = siteScenes.reduce((acc, s) => {
            acc[s.id] = s.name;
            return acc;
        }, {});

        // Step 5: Replace id keys with readable names
        const finalGrouped = {};
        for (const id of siteSceneIds) {
            const siteName = idNameMap[id] || id; // fallback: keep id if name not found
            finalGrouped[siteName] = groupedById[id];
        }
        return finalGrouped;
    }


}

module.exports = Utility;