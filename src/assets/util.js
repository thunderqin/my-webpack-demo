var getQueryString = (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

var fetch = (api, para, myPara) =>{
	var url = para ? api + $.param(para) : api;

	var postInfo = $.extend({}, myPara);

	return new Promise(function (resolve, reject) {

		$.ajax({
			url: url,
			data: postInfo,
			method: "POST",
			dataType: "jsonp",
			success: function (res) {
				resolve(res);
			},
			fail: function (e) {
				reject(e);
			}
		})
	});
}

export {
	fetch,
	getQueryString
};