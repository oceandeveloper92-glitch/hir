const { Employee } = require("./models");
const { sequelize } = require("./config/db");

async function checkUser() {
  try {
    await sequelize.authenticate();
    const employee = await Employee.findOne({ where: { email: 'kiran@hirinternational.com' } });
    if (employee) {
      console.log("Employee found:");
      console.log("ID:", employee.id);
      console.log("Email:", employee.email);
      console.log("Password:", employee.password);
      console.log("IsMaster:", employee.isMaster);
    } else {
      console.log("Employee 'kiran@hirinternational.com' not found.");
      const all = await Employee.findAll({ limit: 5 });
      console.log("All employees count:", await Employee.count());
      console.log("Sample employees:", all.map(e => e.email));
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
}

checkUser();
