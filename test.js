
function Bidirectional_binding(store) {
    window.data = store;
    var _proxy = $.extend(true, {}, data);
    function bindDom(key, parentKey, value) {
        var doms, selector = document.querySelector;
        if (parentKey.length) {
            doms = $("[v-bind='" + parentKey.join(".") + "." + key + "']")
        } else {
            doms = $("[v-bind='" + key + "']")
        }
        $.each(doms, function () {
            var dom=this;
            switch (dom.tagName.toLowerCase()) {
                case "input"
                :
                    if (dom.getAttribute("type") === "text") {
                        dom.setAttribute("value",value);
                        dom.oninput = function (event) {
                            if (parentKey.length) {
                                event.target.value&&eval("window.data['" + parentKey.join("']['") + "']['" + key + "']=" + event.target.value);
                            } else {
                                window.data[key] = event.target.value;
                            }
                        };
                    }
                    break;
                default
                :
                    dom.innerText = value;
                    break;
            }
        })
    }
    function defineKey(obj, parentKey) {
        //default []
        var parent = parentKey || [], config = {};
        for (var key in obj) {
            void function (k) {
                //判断该属性是否 不是对象
                if (!$.isPlainObject(obj[k])) {
                    config[k] = {
                        get: function () {
                            return this["proxy_" + k];
                        },
                        set: function (value) {
                            this["proxy_" + k] = value;
                            bindDom(k, parent, value);
                        }
                    };
                    Object.defineProperties(obj, config);
                } else {
                    var arr = parent.slice(0);
                    arr.push(k);
                    //如果是对象 则继续调用该函数 并且把当前key传入祖先key数组中传入进去
                    defineKey(obj[k], arr);
                }
            }(key)
        }

    }
    defineKey(data);
    $.extend(true, data, _proxy);
}
Bidirectional_binding({
    name: "hello", age: {count: 16}
});

