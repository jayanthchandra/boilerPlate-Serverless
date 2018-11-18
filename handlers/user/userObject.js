class User {
  get _baseParams() {
    return {
      TableName: 'User'
    };
  }

  constructor(documentClient) {
    this._documentClient = documentClient;
  }

  async list() {
    const params = this._createParamObject();
    const response = await this._documentClient.scan(params).promise();
    return response.Items || [];
  }

  async paginatedList(size, lastEval=null) {
    const params = this._createParamObject({ Limit: size });
    if (lastEval)
      params.ExclusiveStartKey = lastEval;
    const response = await this._documentClient.scan(params).promise();
    return response;
  }

  async get(id) {
    const params = this._createParamObject({ Key: { id } });
    const response = await this._documentClient.get(params).promise();
    return response.Item;
  }

  async put(contact) {
    const params = this._createParamObject({ Item: contact });
    await this._documentClient.put(params).promise();
    return contact;
  }

  async delete(id) {
    const params = this._createParamObject({ Key: { id } });
    await this._documentClient.delete(params).promise();
    return id;
  }

  _createParamObject(additionalArgs = {}) {
    return Object.assign({}, this._baseParams, additionalArgs);
  }

  async paginatedQuery(indexName, userState, userStatus, size, lastEval=null, filter=null) {
    const params = this._createParamObject({ 
                    IndexName: indexName,  
                    KeyConditionExpression: 'userState = :value1 and userStatus = :value2', 
                    ScanIndexForward: false,
                    ExpressionAttributeValues:{ ':value1': userState, ':value2': userStatus },
                    Limit: size
                  });
    if (lastEval)
      params.ExclusiveStartKey = lastEval;
    if (filter) {
      if (filter.fromDate) {
        params.FilterExpression = '#type > :fromDate';
        params.ExpressionAttributeNames =  {
          "#type": "createdDate",
        };
        params.ExpressionAttributeValues[':fromDate'] = filter.fromDate;
      }
    }
    console.log(params);
    const response = await this._documentClient.query(params).promise();
    return response || [];
  }

}

exports.WorkFlow = WorkFlow;