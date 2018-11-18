const aws = require('aws-sdk');

const docClient = new aws.DynamoDB.DocumentClient();

const getUserDetails = async (mobile) => {
  const params = {
    TableName: 'Auth',
    IndexName: 'mobileNo-index',
    KeyConditionExpression: "mobileNo = :input", 
    ExpressionAttributeValues:{ ":input": mobile },
  }
  const result = await docClient.query(params).promise();
  return result.Items || '';
}

exports.handler = async (event) => {
  const response = {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    isBase64Encoded: false,
  };
  const mobileNo = event.pathParameters.mobileno;
  const userDetails = await getUserDetails(mobileNo);
  if (userDetails) {
  	response.statusCode = 200;
    response.body = JSON.stringify(userDetails[0]);
  }
  console.log(response);
  return response;
};