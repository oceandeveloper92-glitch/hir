const { Employee } = require("./models");
const { sequelize } = require("./config/db");

async function checkUserStatus() {
  try {
    await sequelize.authenticate();
    const employee = await Employee.findOne({ where: { email: 'kiran@hirinternational.com' } });
    if (employee) {
      console.log("Employee status:", employee.status);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
}

checkUserStatus();
