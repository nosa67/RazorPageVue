Vue.component('vue-integer-input-ie11', {
    props: {
        id: String,                 // id
        name: String,               // name
        value: String,              // 初期値
        required: Boolean,          // 必須フラグ
        max: String,                // 最大値
        min: String,                // 最小値
        step:                       // 刻み幅
        {
            type: String,
            default: 1
        },
        requiredErrMsg: String,     // 必須エラーメッセージ
        notIntegerErrMsg: String,   // 非整数エラーメッセージ
        minErrorMessage: String,    // 最小値エラーメッセージ
        maxErrorMessage: String,    // 最大値エラーメッセージ
        stepErrorMessage: String    // 刻み幅エラーメッセージ
    },
    data: function () {
        return {
            integerValue: this.value,       // 入力値との双方向バインド
            basSpanStyle: {                 // 全体のスタイル
                padding: 0,
                margin: 0,
                border: "solid thin",
                display: "inline-flex"
            },
            buttonSpanStyle: {              // 加減算ボタンエリアのスタイル
                padding: 0,
                margin: 0,
                display: "inline-flex",
                "flex-direction": "column"
            },
            inputStyle: {                   // 入力のスタイル
                margin: 0,
                border: 0
            },
            buttonWidth: 30,                // 加減算ボタンの幅
            buttonStyle: {                  // 加減算ボタンのスタイル
                border: 0,
                padding: 0,
                margin: 0,
                "font-size": "0.4em"
            },
            timeoutId:0,                    // 長押し判定のタイマー用
            isMouseDown:false,              // 長押し判定のマウスダウンフラグ
        };
    },
    mounted: function () {

        // マウント時にコンポーネントのサイズを調整する。入力エリアとボタンで全体の幅になるように設定
        if (this.$el.style.width) {
            this.$refs.MainInput.style.width = this.$el.offsetWidth - this.buttonWidth + "px";
        }
        else {
            this.$refs.MainInput.style.width = this.$refs.MainInput.offsetWidth - this.buttonWidth + "px";
        }
        this.$refs.UpButton.style.width = this.buttonWidth + "px";
        this.$refs.UpButton.style.height = this.$el.offsetHeight / 2 + "px";
        this.$refs.DownButton.style.width = this.buttonWidth + "px";
        this.$refs.DownButton.style.height = this.$el.offsetHeight / 2 + "px";
    },
    computed:
    {
        upButtonId: function () {
            return "up_" + this.id;
        },
        downButtonId: function () {
            return "down_" + this.id;
        }
    },
    methods: {
        //================================================================================
        // イベントハンドラ
        //================================================================================
        //----------------------------------------------------------------------
        // キー入力イベント処理
        // 数値と「+」「-」以外の文字の入力を禁止する
        // ただし貼り付けには対応していないので必要なら追加すること
        //----------------------------------------------------------------------
        onKeypress: function (e) {
            // 48～57:数値、43:[-]、45:[+] 以外の入力を禁止
            if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 43 && e.keyCode !== 45) {
                e.preventDefault();
            }
        },

        //----------------------------------------------------------------------
        // キー押下イベント処理
        // 「↑」「↓」のキー入力で数値を加算、減算する
        // キー押下は押し続けると連続して発生するのでクリックと違い繰り返し処理は不要
        //----------------------------------------------------------------------
        onKeyDown: function (e) {
            // 「↑」(code=38)と「↓」(code=40)以外のキーの場合は無視
            if (e.keyCode !== 38 && e.keyCode !== 40) return;

            if (e.keyCode === 38) {
                // 「↑」(code=38)の場合

                // 初期値の調整
                if (!this.initValue(true)) {
                    // 初期値の調整で[false]が返ってくれば、入力値が変更されていないので、加算処理を実施する
                    // 加算処理で[false]が返ってきた場合はmaxを超えてしまうので処理終了
                    if (!this.valueUp()) return;
                }

                // changeイベントを発生させてバリデーションを実施させる
                this.onChange();
            }
            else {
                // 「↓」(code=40)の場合

                // 初期値の調整
                if (!this.initValue(false)) {
                    // 初期値の調整で[false]が返ってくれば、入力値が変更されていないので、減算処理を実施する
                    // 減算処理で[false]が返ってきた場合はmin未満になるので処理終了
                    if (!this.valueDown()) return;
                }

                // changeイベントを発生させてバリデーションを実施させる
                this.onChange();
            }
        },

        //----------------------------------------------------------------------
        // キーアップイベント処理
        // 「↑」「↓」のキーが離されれば内部変数の押下状態を解除する
        //----------------------------------------------------------------------
        onKeyUp: function (e) {
            if (e.keyCode === 38 || e.keyCode === 40) {
                this.isKeyDown = false;
            }
        },

        //----------------------------------------------------------------------
        //  upボタンのマウス押下イベント処理
        //----------------------------------------------------------------------
        onUpMousedown: function (e) {

            // 左ボタン以外は処理をしない
            if (e.button !== 0) return;

            // ボタン押下状態を内部変数に設定
            this.isMouseDown = true;

            // 初期値の調整
            if (!this.initValue(true)) {
                // 初期値の調整で[false]が返ってくれば、入力値が変更されていないので、加算処理を実施する
                // 加算処理で[false]が返ってきた場合はmaxを超えてしまうので処理終了
                if (!this.valueUp()) return;
            }

            // changeイベントを発生させてバリデーションを実施させる
            this.onChange();

            // 押し続けた場合の加算繰り返し処理を定義
            var valueUpCallback = function (me) {

                // タイマーを一旦クリア
                clearTimeout(me.timeoutId);
                me.timeoutId = 0;

                if (me.isMouseDown) {
                    // 加算処理（falseならmaxを超えるので終了）
                    if (!me.valueUp()) return;

                    // この処理を繰り返す
                    me.timeoutId = setTimeout(valueUpCallback, 50, me);
                }
            };

            // マウスが押されたままなら、加算繰り返し処理を実施
            if (this.isMouseDown) {
                this.timeoutId = setTimeout(valueUpCallback, 500, this);
            }
        },

        //----------------------------------------------------------------------
        //  downボタンのmousedownイベント処理
        //----------------------------------------------------------------------
        onDownMousedown: function (e) {

            // 左ボタン以外は処理をしない
            if (e.button !== 0) return;

            // ボタン押下状態を内部変数に設定
            this.isMouseDown = true;

            // 初期値の調整
            if (!this.initValue(false)) {
                // 初期値の調整で[false]が返ってくれば、入力値が変更されていないので、減算処理を実施する
                // 減算処理で[false]が返ってきた場合はmin未満になるので処理終了
                if (!this.valueDown()) return;
            }

            // バリデーションを実施させる
            this.onChange();

            // 押し続けた場合の減算繰り返し処理を定義
            var valueDownCallback = function (me) {

                // タイマーを一旦クリア
                clearTimeout(me.timeoutId);
                me.timeoutId = 0;

                if (me.isMouseDown) {
                    // 減算処理（falseならmin未満になるので終了）
                    if (!me.valueDown()) return;

                    // この処理を繰り返す
                    me.timeoutId = setTimeout(valueDownCallback, 50, me);
                }
            };

            // マウスが押されたままなら、減算繰り返し処理を実施
            if (this.isMouseDown) {
                this.timeoutId = setTimeout(valueDownCallback, 500, this);
            }
        },

        //----------------------------------------------------------------------
        //  upボタンおよびdownボタンのマウスアップイベントおよびマウス離脱イベント処理（mouseup,mouseleave）
        //----------------------------------------------------------------------
        onMouseup: function (e) {
            // 内部変数のマウス押下状態を解除
            this.isMouseDown = false;

            // マウス押下時の連続処理が設定されているなら解除
            if (this.timeoutId !== 0) {
                clearTimeout(this.timeoutId);
                this.timeoutId = 0;
            }
        },

        //----------------------------------------------------------------------
        // inputのchangeイベント処理
        //----------------------------------------------------------------------
        onChange: function () {

            //  デフォルトのバリデーションエラーが有れば処理終了
            if (window.IsDefaultValidationError(this.$refs.MainInput.validity)) {
                // ここでカスタムエラーを削除
                this.$refs.MainInput.setCustomValidity("");
                return;
            }

            // 整数チェックバリデーション
            if (!this.IntegerValidation(this.$refs.MainInput)) return;

            // エラーが無いのでカスタムエラーを削除
            this.$refs.MainInput.setCustomValidity("");
        },

        //----------------------------------------------------------------------
        // inputのinvalidイベント処理
        //----------------------------------------------------------------------
        onInvalid: function (e) {
            // 入力必須エラーメッセージの変更（変更した場合は処理終了）
            if (window.requiredMsgChange(this.$refs.MainInput, this.requiredErrMsg)) return;

            // range指定エラーメッセージの変更
            if (rangeMsgChange(this.$refs.MainInput, this.maxErrorMessage, this.minErrorMessage, this.stepErrorMessage)) return;
        },

        //======================================================================
        // 内部メソッド
        //======================================================================
        //----------------------------------------------------------------------
        //  「↑」「↓」キーや加算、減算ボタンによる最初の処理
        //  引数
        //    isUp  : 加算の場合に[true]現座の場合に[false]を設定する
        //  返値
        //    true  : 初期値を設定した（既存入力がmin,max,stepに合致しなかった場合も含む）
        //    false : 初期値は設定されなかった
        //----------------------------------------------------------------------
        initValue: function (isUp) {

            // 既存の値が設定されている場合はそれを初期値とし入っていなければ0を初期値とする
            var currentValue = 0;
            if (isInteger(this.integerValue)) currentValue = parseInt(this.integerValue);
                
            // step区切りの基準値はデフォルトが0でminが設定されている場合はminとする
            var baseValue = 0;
            if (isInteger(this.min)) baseValue = this.min;

            // 最小値が整数で設定されていて、初期値がそれより小さい場合は最小値を設定してtrueを返す
            if (isInteger(this.min) && this.min > currentValue) {
                this.integerValue = this.min;
                return true;
            }

            // 最大値が整数で設定されていて、初期値がそれより大きい場合は最大値に最も近いstep区切りの値を設定して終了
            if (isInteger(this.max) && this.max < currentValue) {
                this.integerValue = this.RoundStep(baseValue, this.step, this.max, false);
                return true;
            }

            // 初期値をstepで丸めた値を取得(引数により切り上げまたは切り下げを実施)
            var newValue = this.RoundStep(baseValue, this.step, currentValue, isUp);
            if (isUp) {
                // 加算の場合は最大値を超えていれば1step減算
                if (isInteger(this.max) && this.max < newValue) {
                    newValue = newValue - this.step;
                }
            }
            else {
                // 減算の場合は最小値未満なら1step加算
                if (isInteger(this.min) && this.min > newValue) {
                    newValue = newValue + this.step;
                }
            }

            // 既存入力が無いか、初期値と異なっている場合は初期値を設定してtrueを返す
            if (!isInteger(this.integerValue) || (parseInt(this.integerValue) !== currentValue)) {
                this.integerValue = newValue;
                return true;
            }

            // 入力されている値はmin,max範囲内でstepも正常なので何もせずfalseを返す。
            return false;
        },

        //----------------------------------------------------------------------
        //  加算処理（min,stepによる妥当性は確認していないので、その確認後に利用する必要がある）
        //  返値
        //    true  : 加算した
        //    false : maxを超えるので加算できない
        //----------------------------------------------------------------------
        valueUp: function () {
            // 現在地にstepを加算
            var newNumber = parseInt(this.integerValue) + parseInt(this.step);

            // 最大値を超えるならfalseを返す
            if (isInteger(this.max) && this.max < newNumber) return false;

            // 加算した値を設定
            this.integerValue = newNumber;

            // 変更ベントを発生
            this.onChange();

            // trueを返す
            return true;
        },

        //----------------------------------------------------------------------
        //  減算処理（min,stepによる妥当性は確認していないので、確認後に利用する必要がある）
        //  返値
        //    true  : 減算した
        //    false : min未満になるので加算できない
        //----------------------------------------------------------------------
        valueDown: function () {
            // 現在地からstepを減算
            var newNumber = parseInt(this.integerValue) - parseInt(this.step);

            // 最小未満ならfalseを返す
            if (isInteger(this.min) && this.min > newNumber) return false;

            // 減算した値を設定
            this.integerValue = newNumber;

            // 変更ベントを発生
            this.onChange();

            // trueを返す
            return true;
        },

        //----------------------------------------------------------------------
        // 設定する値を最小値から刻み幅に合致した値に変更する
        // 引数
        //  min     : 最小値（基準値）
        //  step    : 刻み幅
        //  value   : 現在値
        //  isUp    : 加算の場合[true]、減算の場合[false]
        //----------------------------------------------------------------------
        RoundStep: function (min, step, value, isUp) {

            // （現在地 - 最小値）/ 刻み幅　の余りを計算
            var amari = (parseInt(value) - parseInt(min)) % parseInt(step);

            if (amari === 0) {
                // 余りが0ならそのまま返す
                return value;
            }
            else {
                // 余りが0でない場合刻み幅に調整する
                if (amari < 0) {
                    if (isUp) {
                        // 加算の場合は余りを加算（余りが負の値なので減算）
                        return parseInt(value) - amari;
                    }
                    else {
                        // 減算の場合は(刻み幅-余り)を減算（余りが負の値なので減算）
                        return parseInt(value) - amari - parseInt(step);
                    }
                }
                else {
                    if (isUp) {
                        // 加算の場合は(刻み幅-余り)を加算
                        return parseInt(value) - amari + parseInt(step);
                    }
                    else {
                        // // 減算の場合は余りを減算
                        return parseInt(value) - amari;
                    }
                }
            }
        },
        //----------------------------------------------------------------------
        // 整数バリデーション
        //----------------------------------------------------------------------
        IntegerValidation: function () {

            // 空ならtrue;(空はRequiredでチェックする)
            if (!this.integerValue) return true;

            // 整数判定
            if (!isInteger(this.integerValue)) {
                // 整数でない場合

                // 変更エラーメッセージを取得
                if (this.notIntegerErrMsg) {
                    // 変更エラーメッセージがある場合は変更エラーメッセージを設定
                    this.$refs.MainInput.setCustomValidity(this.notIntegerErrMsg);
                }
                else {
                    // 変更エラーメッセージが無ければデフォルトのエラーメッセージを設定
                    this.$refs.MainInput.setCustomValidity("整数を入力してください");
                }
                return false;
            }

            return true;
        }
    },
    template:
        '<span :style=basSpanStyle>\
            <input \
                ref="MainInput" \
                v-model=integerValue \
                :id=id \
                :name=name \
                type="number" \
                :style=inputStyle \
                :required=required \
                :max=max :min=min \
                :step=step \
                @keydown=onKeyDown \
                @keyup=onKeyUp \
                @keypress=onKeypress \
                @change=onChange \
                @invalid=onInvalid>\
            <span :style=buttonSpanStyle>\
                <button :id=upButtonId type="button" ref="UpButton" \
                    :style=buttonStyle \
                    @mousedown=onUpMousedown \
                    @mouseleave=onMouseup \
                    @mouseup=onMouseup >▲</button>\
                <button :id=downButtonId type="button" ref="DownButton" \
                    :style=buttonStyle \
                    @mousedown=onDownMousedown \
                    @mouseleave=onMouseup \
                    @mouseup=onMouseup >▼</button>\
            </span>\
        </span>'
});

Vue.component('vue-integer-input-normal', {
    props: {
        id: String,                     // id
        name: String,                   // name
        required: Boolean,              // 必須フラグ
        value: String,                  // 初期値
        max: String,                    // 最大値
        min: String,                    // 最小値
        step: String,                   // 刻み幅
        requiredErrMsg: String,         // 必須エラーメッセージ
        notIntegerErrMsg: String,       // 非整数エラーメッセージ
        minErrorMessage: String,        // 最小値エラーメッセージ
        maxErrorMessage: String,        // 最大値エラーメッセージ
        stepErrorMessage: String        // 刻み幅エラーメッセージ
    },
    data: function () {
        return {
            integerValue: this.value
        };
    },
    methods: {
        //----------------------------------------------------------------------
        // キー入力イベント処理
        // 数値と「+」「-」以外の文字の入力を禁止する
        // ただし貼り付けには対応していないので必要なら追加すること
        //----------------------------------------------------------------------
        onKeypress: function (e) {
            // 48～57:数値、43:[-]、45:[+] 以外の入力を禁止
            if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 43 && e.keyCode !== 45 && e.keyCode !== 46) {
                e.preventDefault();
            }
        },
        //----------------------------------------------------------------------
        // inputのchangeイベント処理
        //----------------------------------------------------------------------
        onChange: function () {

            //  デフォルトのバリデーションエラーが有れば処理終了
            if (window.IsDefaultValidationError(this.$refs.MainInput.validity)) {
                // ここでカスタムエラーを削除
                this.$refs.MainInput.setCustomValidity("");
                return;
            }

            // 整数チェックバリデーション(指数入力[1e3等]を除外する為)
            if (!this.IntegerValidation(this.$refs.MainInput)) return;

            // エラーが無いのでカスタムエラーを削除
            this.$refs.MainInput.setCustomValidity("");
        },
        //----------------------------------------------------------------------
        // inputのinvalidイベント処理
        //----------------------------------------------------------------------
        onInvalid: function (e) {
            // 入力必須エラーメッセージの変更（変更した場合は処理終了）
            if (window.requiredMsgChange(this.$refs.MainInput, this.requiredErrMsg)) return;

            // range指定エラーメッセージの変更
            if (rangeMsgChange(this.$refs.MainInput, this.maxErrorMessage, this.minErrorMessage, this.stepErrorMessage)) return;
        },
        //----------------------------------------------------------------------
        // 整数バリデーション
        //----------------------------------------------------------------------
        IntegerValidation: function () {

            // 空ならtrue;(空はRequiredでチェックする)
            if (!this.integerValue) return true;

            // 整数判定
            if (!isInteger(this.integerValue)) {
                // 整数でない場合

                // 変更エラーメッセージを取得
                if (this.notIntegerErrMsg) {
                    // 変更エラーメッセージがある場合は変更エラーメッセージを設定
                    this.$refs.MainInput.setCustomValidity(this.notIntegerErrMsg);
                }
                else {
                    // 変更エラーメッセージが無ければデフォルトのエラーメッセージを設定
                    this.$refs.MainInput.setCustomValidity("整数を入力してください");
                }
                return false;
            }

            return true;
        }
    },
    template:
        '<input ref="MainInput" \
            :id=id \
            :name=name \
            v-model="integerValue" \
            type="number" \
            :required=required \
            :max=max :min=min \
            :step=step \
            @keypress=onKeypress \
            @change=onChange \
            @invalid=onInvalid>'
});

Vue.component('vue-integer-input', {
    props: {
        id: String,                     // タグのid属性
        name: String,                   // タグのname属性
        value: String,                  // 初期値
        required: Boolean,              // 必須フラグ
        max: String,                    // 最大値
        min: String,                    // 最小値
        step:                           // 刻み幅
        {
            type: String,
            default: "1"
        },
        requiredErrMsg: String,         // 必須エラーメッセージ
        notIntegerErrMsg: String,       // 非整数エラーメッセージ
        minErrorMessage: String,        // 最小値エラーメッセージ
        maxErrorMessage: String,        // 最大値エラーメッセージ
        stepErrorMessage: String        // 刻み幅エラーメッセージ
    },
    data: function () {
        return {
            elementType: this.getElementType() 
        };
    },
    methods: {
        getElementType: function()
        {
            elementType: if (window.IsBroser("MSIE11") ) {
                return "vue-integer-input-ie11";
            }
            else {
                return "vue-integer-input-normal";
            }
        }
    },
    template:
        '<component :is=elementType\
            :id=id \
            :name=name \
            :value=value \
            :required=required :requiredErrMsg=requiredErrMsg \
            :notIntegerErrMsg=notIntegerErrMsg \
            :max=max :min=min :step=step \
            :minErrorMessage=minErrorMessage :maxErrorMessage=maxErrorMessage :stepErrorMessage=stepErrorMessage></component > '
});