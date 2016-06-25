/**
 * Created by renyubin on 16/4/23.
 */
export function postFetchData(apiUrl,body,callback) {
    console.log(apiUrl+"-"+body)
    fetch(apiUrl, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if (responseJson['success'] !== true) {
                callback(responseJson);
            } else {
                callback(responseJson);
            }
        }).catch((error) => {
        console.warn(error);
    }).done();
}
export function getFetchData(apiUrl,callback) {
    console.log(apiUrl)
    fetch(apiUrl, {
        method: 'get',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if (responseJson['success'] !== true) {
                callback(responseJson);
            } else {
                callback(responseJson['result']);
            }
        }).catch((error) => {
        console.warn(error);
        //callback(error);
    }).done();
}
