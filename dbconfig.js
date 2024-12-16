const config = {
    user: "sa",
    password: "123",
    server: "AVS-IND-LT-049",
    database: "Products",
    options: {
      trustServerCertificate: true,
      trustedConnection: false,
      enableArithAbort: true,
      instancename: "SQLEXPRESS"
    },
    //54616
    //port:1433
}
module.exports = config;