const { IncentiveSettingsModal } = require('../models');

exports.getAllIncentives = async (req, res) => {
    try {
        const incentives = await IncentiveSettingsModal.findAll();
        res.status(200).json({ data: incentives, message: 'Incentives fetched successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `${error.message}` });
    }
};

exports.getIncentiveById = async (req, res) => {
    try {
        const { id } = req.params;
        const incentive = await IncentiveSettingsModal.findByPk(id);
        if (!incentive) {
            return res.status(404).json({ error: 'Incentive not found' });
        }
        res.status(200).json({ data: incentive, message: 'Incentive fetched successfully' });
    } catch (error) {
        res.status(500).json({ error: `${error.message}` });
    }
};

exports.createIncentive = async (req, res) => {
    try {
        const newIncentive = await IncentiveSettingsModal.create(req.body);
        res.status(201).json({ data: newIncentive, message: 'Incentive created successfully' });
    } catch (error) {
        res.status(500).json({ error: `${error.message}` });
    }
};

exports.updateIncentive = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await IncentiveSettingsModal.update(req.body, { where: { id } });
        if (!updated) {
            return res.status(404).json({ error: 'Incentive not found' });
        }
        const updatedIncentive = await IncentiveSettingsModal.findByPk(id);
        res.status(200).json({ data: updatedIncentive, message: 'Incentive updated successfully' });
    } catch (error) {
        res.status(500).json({ error: `${error.message}` });
    }
};

exports.deleteIncentive = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await IncentiveSettingsModal.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ error: 'Incentive not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: `${error.message}` });
    }
};


