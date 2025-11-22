const DataLayer = require('companydata');

console.log('Testing database connection...');
console.log('DataLayer module:', typeof DataLayer);

if (typeof DataLayer !== 'function') {
    console.error('❌ ERROR: DataLayer is not a constructor function');
    console.error('   This means companydata module is not installed correctly');
    console.error('\nFix:');
    console.error('1. Make sure "DataLayer for Students/companydata" folder exists');
    console.error('2. Run: npm install');
    process.exit(1);
}

let dl;
try {
    console.log('\n1. Creating DataLayer instance...');
    dl = new DataLayer('im3811');
    console.log('   ✅ DataLayer created successfully');

    console.log('\n2. Testing connection by getting departments...');
    const depts = dl.getAllDepartment('im3811');
    console.log(`   ✅ Connected! Found ${depts.length} departments`);

    if (depts.length === 0) {
        console.log('\n📝 Database is empty (this is normal for first run)');
        console.log('   Use your API to add data via Postman');
    } else {
        console.log('\n📋 Departments in database:');
        depts.forEach(dept => {
            console.log(`   - ${dept.getDeptName()} (${dept.getDeptNo()})`);
        });
    }

} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nPossible causes:');
    console.error('1. Not connected to RIT VPN/network');
    console.error('2. Database server is down');
    console.error('3. companydata module not installed correctly');
} finally {
    if (dl && typeof dl.close === 'function') {
        dl.close();
        console.log('\n3. Database connection closed ✓');
    }
}

console.log('\n' + '='.repeat(50));
console.log('Test complete!');
