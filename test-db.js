const DataLayer = require('companydata');

console.log('==============================================');
console.log('Testing Database Connection');
console.log('==============================================\n');

const COMPANY_NAME = 'im3811';
const DB_NAME = `${COMPANY_NAME}_company`;

console.log(`Company: ${COMPANY_NAME}`);
console.log(`Database: ${DB_NAME}\n`);

let dl;
try {
    console.log('Step 1: Creating DataLayer instance...');
    dl = new DataLayer(COMPANY_NAME);
    console.log('   ✅ DataLayer created successfully\n');

    console.log('Step 2: Testing getAllDepartment...');
    const depts = dl.getAllDepartment(COMPANY_NAME);
    
    if (depts && Array.isArray(depts)) {
        console.log(`   ✅ Connected! Found ${depts.length} departments\n`);
        
        if (depts.length === 0) {
            console.log('📝 Database is empty (this is normal for first run)');
            console.log('   Use Postman to add departments via your API\n');
        } else {
            console.log('📋 Departments in database:');
            depts.forEach(dept => {
                console.log(`   - ID: ${dept.getId()} | ${dept.getDeptName()} (${dept.getDeptNo()}) | ${dept.getLocation()}`);
            });
            console.log();
        }
    } else {
        console.log('   ❌ Query returned invalid data\n');
    }

    console.log('Step 3: Testing getAllEmployee...');
    const employees = dl.getAllEmployee(COMPANY_NAME);
    
    if (employees && Array.isArray(employees)) {
        console.log(`   ✅ Found ${employees.length} employees\n`);
        
        if (employees.length > 0) {
            console.log('📋 Employees in database:');
            employees.forEach(emp => {
                console.log(`   - ID: ${emp.getId()} | ${emp.getEmpName()} (${emp.getEmpNo()}) | ${emp.getJob()}`);
            });
            console.log();
        }
    }

    console.log('==============================================');
    console.log('✅ SUCCESS! Database is working correctly!');
    console.log('==============================================\n');
    console.log('Next steps:');
    console.log('1. Run: npm start');
    console.log('2. Test with Postman: http://localhost:8080/CompanyServices/departments?company=im3811');
    console.log();

} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error details:');
    console.error(error);
    console.error('\n==============================================');
    console.error('Troubleshooting:');
    console.error('==============================================');
    console.error('1. MySQL running? Check: sudo systemctl status mysql');
    console.error('2. Database created? Run setup-database.sql in MySQL Workbench');
    console.error('3. Credentials correct? Check DataLayer.js line with host/usr/pwd');
    console.error('4. Check connection: mysql -u root -p -e "SHOW DATABASES;"');
    console.error();
    
    if (error.message.includes('ECONNREFUSED')) {
        console.error('❌ MySQL server not running or not on port 3306');
    } else if (error.message.includes('Access denied')) {
        console.error('❌ Wrong username/password in DataLayer.js');
    } else if (error.message.includes('Unknown database')) {
        console.error('❌ Database im3811_company does not exist');
        console.error('   Solution: Run setup-database.sql in MySQL Workbench');
    }
} finally {
    if (dl && typeof dl.close === 'function') {
        dl.close();
        console.log('Database connection closed ✓\n');
    }
}
