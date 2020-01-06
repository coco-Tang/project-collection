import { Injectable } from "@angular/core";

@Injectable()
export class Helper {

  openLink (link) {
    window.open(link, "_system", "location=yes");
  }

  versionCompare (v1, v2, options) {
    var lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend,
      v1parts = v1.split('.'),
      v2parts = v2.split('.');

    function isValidPart (x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push("0");
      while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1;
      }

      if (v1parts[i] == v2parts[i]) {
        continue;
      }
      else if (v1parts[i] > v2parts[i]) {
        return 1;
      }
      else {
        return -1;
      }
    }

    if (v1parts.length != v2parts.length) {
      return -1;
    }

    return 0;
  }

  arr2obj (arr, key) {
    if (!arr || arr.length < 1) {
      return {};
    }
    key = key || "id";
    var isKeyRepeat = false
    var len = arr.length;
    for (var i = 0; i < len; i++) {
      for (var j = i + 1; j < len; j++) {
        if (arr[i][key] == arr[j][key]) {
          isKeyRepeat = true;
          break;
        }
      }
      if (isKeyRepeat == true) {
        break;
      }
    }

    var _obj = {}
    if (isKeyRepeat) {
      arr.forEach(function (e, i) {
        if (e[key]) {
          if (!_obj[e[key]]) {
            _obj[e[key]] = [];
          }
        }
        _obj[e[key]].push(e);
      });
    } else {
      arr.forEach(function (e, i) {
        if (e[key]) {
          _obj[e[key]] = e;
        }
      });
    }
    return _obj;
  }

  URL = {
    setParameter: function (key, value, url) {
      if (!key) {
        return url;
      }

      if (!url) {
        url = location.href;
      }

      var result = url,
        params;

      var param_start = url.indexOf('?');
      if (param_start > 0) {
        params = this.URL.getParamsMap(url);
        result = url.substr(0, param_start);
      } else {
        params = {};
      }

      params[key] = value;

      result = this.URL.getUrl(result, params);

      return result;
    },

    getParameter: function (key, url) {
      if (!key) {
        return url;
      }

      if (!url) {
        url = location.href;
      }

      var params = this.URL.getParamsMap(url);

      return params[key];

    },

    deleteParameter: function (key, url) {
      if (!key) {
        return url;
      }

      if (!url) {
        url = location.href;
      }
      var result = url,
        param_start = url.indexOf('?');
      if (param_start > 0) {
        result = url.substr(0, param_start);
      }

      var params = this.URL.getParamsMap(url);

      if (params[key] !== undefined) {
        delete params[key];
      }
      return this.URL.getUrl(result, params);
    },

    getParamsMap: function (url) {
      if (!url) {
        url = location.href;
      }
      var params = {},
        param_start = url.indexOf('?');

      if (param_start > 0) {
        var search = url.substr(param_start + 1);

        var params_array = search.split('&');
        if (params_array.length > 0) {
          for (var i = 0, l = params_array.length; i < l; i++) {
            var param = params_array[i];
            if (typeof param == "string" && param != '') {
              var parts = param.split('=');
              if (parts.length > 0) {
                params[parts[0]] = parts[1];
              }
            }
          }
        }
      }
      return params;
    },

    getUrl: function (base_url, params) {
      var result = base_url,
        query_array = [];

      for (let key in params) {
        if (params[key] !== undefined && params[key] !== '') {
          query_array.push(key + "=" + params[key]);
        }
      }

      if (query_array.length > 0) {
        result = result + "?" + query_array.join('&');
      }

      return result;
    }
  }

  elasticRefresh (event) {
    let distance;
    if (event.deltaY < 100) {
      distance = event.deltaY / 2;
    } else if (event.deltaY >= 100 && event.deltaY < 400) {
      distance = 100 / 2 + (event.deltaY - 100) / 3;
    } else if (event.deltaY >= 400 && event.deltaY < 800) {
      distance = 100 / 2 + 300 / 3 + (event.deltaY - 400) / 5;
    } else {
      distance = 100 / 2 + 300 / 3 + 400 / 5 + (event.deltaY - 800) / 8;
    }
    event._content.setScrollElementStyle(event._plt.Css.transform, ((event.deltaY > 0) ? 'translateY(' + distance + 'px) translateZ(0px)' : 'translateZ(0px)'));
  }
}