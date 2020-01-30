export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 *
 * @param {String} url (local) textfile
 * @param {Callback} callback callback with text as first parameter
 */
export function loadTextResource(url, callback) {
	const request = new XMLHttpRequest()
	request.open('GET', url + '?please-dont-cache=' + Math.random(), true)
	request.onload = function () {
		callback(request.responseText, url)
	}
	request.send()
}

/**
 * TODO never tested
 * @param {Array<String>} urlsArr 
 * @param {Callback} callback 
 * @returns
 */
export function loadTextResources(urlsArr, callback) {

    const result = {}

    function mycallback(text, url){
        result[url] = text
        if(Object.size(result) == urlsArr.length)
            callback(result)
    }

    for(let url of urlsArr){
        loadTextResource(url, mycallback)
    }
}