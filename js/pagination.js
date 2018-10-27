/* 分页插件 */
~(function($, window, document, undefined) {
    function Pagination(elem, opts) {
        this.defaults = {
            // 总页数
            total: 10,
            // 当前页
            current: 1,
            // 点击回调函数
            callback: function(page) {
                //
            }
        };
        this.$elem = elem;
        this.options = $.extend({}, this.defaults, opts);
        this.total = this.options.total;
        this.current = this.options.current;
        this.callback = this.options.callback;

        this.init();
    };

    Pagination.prototype = {
        constructor: Pagination,
        init: function() {
            this.update();
            this.bindEvent();
        },
        update: function() {
            var html = '';
            /* 上一页 */
            if (this.current > 1) {
                html += '<a href="javascript:;" class="prev">上一页</a>';
            } else {
                html += '<span class="disabled">上一页</span>';
            }
            /* 中间页 */
            if (this.current > 4) {
                html += '<a href="javascript:;" class="num">' + 1 + '</a>';
                html += '<a href="javascript:;" class="num">' + 2 + '</a>';

                if (this.total > 9) {
                    html += '<span class="ellipsis">...</span>';
                }
            }

            if (this.current > 4 && this.current <= this.total - 5) {
                var start  = this.current - 2, end = this.current + 2;
            } else if (this.current > 4 && this.current > this.total - 5) {
                var start  = this.current - 2, end = this.total;
            } else {
                var start = 1, end = 9;
            }

            for (; start <= end; start++) {
                if (start <= this.total && start >= 1) {
                    if (start == this.current) {
                        html += '<span class="active">' + start + '</span>';
                    } else {
                        html += '<a href="javascript:;" class="num">' + start + '</a>';
                    }
                }
            }

            if (end < this.total) {
                html += '<span class="ellipsis">...</span>';
            }

            /* 下一页 */
            if (this.current >= this.total) {
                html += '<span class="disabled">下一页</span>';
            } else {
                html += '<a href="javascript:;" class="next">下一页</a>';
            }

            /* 手动输入工具栏 */
            var go = parseInt(this.current) + 1 > this.total ? this.total : parseInt(this.current) + 1;
            html += '<span class="tools">共<b>' + this.total + '</b>页，'+'到第'+'<input type="text" class="input" value="' + go + '"/>'+'页'+'</span>';
            html += '<span class="ok">'+'确定'+'</span>';

            this.$elem.html(html);
        },
        bindEvent: function() {
            var _this = this;
            this.$elem.off('click', 'a, span');
            /* 上一页 */
            this.$elem.on("click", "a.prev", function() {
                if (_this.current == 1) return;
                _this.current = _this.current - 1;
                _this.update();
                if (typeof _this.callback === 'function') {
                    _this.callback(_this.current);
                }
            });
            /* 下一页 */
            this.$elem.on("click", "a.next", function() {
                if (_this.current == _this.total) return;
                _this.current = _this.current + 1;
                _this.update();
                if (typeof _this.callback === 'function') {
                    _this.callback(_this.current);
                }
            });
            /* 具体页数 */
            this.$elem.on("click", "a.num", function() {
                _this.current = parseInt($(this).text());
                _this.update();
                if (typeof _this.callback === 'function') {
                    _this.callback(_this.current);
                }
            });
            /* 根据用用户输入点击确定 */
            function okFunc() {
                var num = parseInt($("input.input").val());
                if (num > _this.total || num == _this.current || num < 1) {
                    $("input.input").focus();
                    return;
                };
                _this.current = num;
                _this.update();
                if (typeof _this.callback === 'function') {
                    _this.callback(_this.current);
                }
            }
            this.$elem.on("click", "span.ok", function() {
                okFunc();
            });

            /* 回车确认 */
            this.$elem.on("keypress", "input.input", function(ev) {
                if (ev.keyCode == 13) {
                    okFunc();
                }
            });
        }
    };

    $.fn.Pagination = function(opts) {
        return new Pagination($(this), opts);
    }

})(jQuery, window, document);