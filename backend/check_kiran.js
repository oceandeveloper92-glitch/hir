const { Employee } = require("./models");
const { sequelize } = require("./config/db");

async function checkKiran() {
  try {
    await sequelize.authenticate();
    const kiran = await Employee.findOne({ where: { email: 'kiran@hirinternational.com' } });
    if (kiran) {
      console.log('--- Kiran Record ---');
      console.log('ID:', kiran.id);
      console.log('Email:', kiran.email);
      console.log('Password (Stored):', kiran.password);
      console.log('isMaster:', kiran.isMaster);
      console.log('Status:', kiran.status);
    } else {
      console.log('Kiran not found in employees table.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkKiran();
