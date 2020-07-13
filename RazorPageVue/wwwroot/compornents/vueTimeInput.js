//****************************************************************************************************
//  IE11用コンポーネント
//****************************************************************************************************
Vue.component('vue-time-input-ie11', {
    props:
    {
        id: String,                     // タグのidに設定される文字列
        name: String,                   // タグのnameに設定される文字列
        value: String,                  // 入力された時刻文字列
        required: Boolean,              // 必須フラグ
        requiredErrMsg: String,         // 必須エラーメッセージ
        step: String,                   // ステップ
        stepErrorMessage: String,       // ステップエラーメッセージ
        min: String,                    // 最小時刻
        minErrorMessage: String,        // 最小時刻エラーメッセージ
        max: String,                    // 最大時刻
        maxErrorMessage: String,        // 最大時刻エラーメッセージ
    },
    data: function()
    {
        return {
            hour: "--",                     // 時部分の文字列
            minute: "--",                   // 分部分の文字列
            second: "--",                   // 秒部分の文字列
            hourStep: 1,                    // 時のステップ（デフォルト：1）
            muniteStep: 1,                  // 分のステップ（デフォルト：1、「0」になると時間刻みで変更不可となる）
            secondStep: 0,                  // 秒のステップ（デフォルト：0、「0]になると分か時刻みとなり、秒は表示されなくなる）
            editTarget: "none",             // 編集中の時刻部分（時：hour、分：munite、秒：second）
            isSecondInput:false,
            basSpanStyle: {                 // 全体のフレームとなるspanタグのスタイル
                padding: 0,                 
                margin: 0,
                border: "solid thin",
                display: "inline-flex"
            },
            inputStyle: {                   // 入力用のinputフォーム
                margin: 0,
                border: 0,
                textAlign: "center",
                width:"3em"
            },
            delButtonStyle: {               // 「x」削除ボタンのスタイル
                margin: 0,
                border: 0,
                background: "transparent",
                width: "1.5em"
            },
            buttonSpanStyle: {              // 加算減算ボタンエリアのspanタグのスタイル
                border: "solid 1px black",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column"
            },
            buttonStyle: {                  // 加算減算ボタンタグのスタイル
                border: 0,
                padding: 0,
                margin: 0,
                width: "4em",
                "font-size": "0.4em"
            }
        };

    },
    //================================================================================
    // コンポーネントマウント時の処理
    //================================================================================
    mounted: function () {
        // stepから値を設定する
        // 60未満
        /// 60を割り切れる　：はそのまま秒の刻み幅に設定
        //  上記以外　　　　：デフォルト（分刻み）
        // 3600未満
        //  3600を割り切れて、60で割り切れる：60で割った数を分の刻み幅にする
        //  上記以外　　　　　　　　　　　　：デフォルト（分刻み）
        // 3600以上
        //  86400を割り切れて3600で割り切れるな：3600で割った数を時の刻み幅にする
        //  上記以外　　　　　　　　　　　　：デフォルト（分刻み）
        // 86400以上
        //  デフォルト（分刻み）
        if (this.step < 60) {
            if (60 % this.step === 0) {
                this.secondStep = Number(this.step);      
            }
        }
        else {
            if (this.step < 3600) {
                if (3600 % this.step === 0 && this.step % 60 === 0) {
                    this.muniteStep = this.step / 60;     
                }
            } else {
                this.muniteStep = 0;    
                if (this.step < 86400) {
                    if (86400 % this.step === 0 && this.step % 3600 === 0) {
                        this.hourStep = this.step / 3600;     
                    }
                }
            }
        }

        // 秒が非表示（秒の刻み幅が0）の場合は入力エリアの幅を小さくする
        if (this.secondStep !== 0) {
            this.inputStyle.width = "4em";
        }

        // 加減算ボタンの高さを調整(表示高さの半分にする)
        this.$refs.UpButton.style.height = ((this.$refs.base.offsetHeight / 2) - 1) + "px";
        this.$refs.DownButton.style.height = ((this.$refs.base.offsetHeight / 2) - 1) + "px";

        // valueの値を編集用のhour,munite,secondに分割する
        // 分の刻み幅が0の場合、「00」に強制する
        if (isTime(this.value)) {
            var times = this.value.split(":");
            this.hour = times[0];
            if (this.muniteStep === 0) {
                this.munite = "00";
            }
            else {
                if (times.length >= 2) this.minute = times[1];
            }
            if (this.secondStep !== 0) {
                if (times.length >= 3) this.second = times[2];
            }
        }

        // 初期値の調整
        this.updateInput();
    },
    computed:
    {
        useSecond: function () {                    // 秒の入力を行うかどうかのフラグ（秒の刻み幅が0なら対象外）
            return !((this.step % 60) === 0);
        },
        inputId: function () {                      // 実際の入力のid
            return "input_" + this.id;
        },
        deleteId: function () {                     // 削除ボタンのid
            return "del_" + this.id;
        },
        upId: function () {                         // 加算ボタンのid
            return "up_" + this.id;
        },
        downId: function () {                       // 減算ボタンのid
            return "down_" + this.id;
        }
    },
    methods: {
        //================================================================================
        // イベントハンドラ
        //================================================================================
        //----------------------------------------------------------------------
        // クリック
        //   クリックされた対象（時、分、秒）を選択状態にする（通常のフォーカス状態は作成できない様にしている）
        //----------------------------------------------------------------------
        onClick: function () {
            this.selectEditTarget();
            this.selectEditArea();
            this.isSecondInput = false;
        },

        //----------------------------------------------------------------------
        //  フォーカス取得
        //    編集対象（時、分、秒）を選択状態にする（通常のフォーカス状態は作成できない様にしている）
        //----------------------------------------------------------------------
        onFocus: function () {
            this.selectEditTarget();
            this.selectEditArea();
            this.isSecondInput = false;
        },

        //----------------------------------------------------------------------
        // キー押下イベント処理
        //   キーコード:38[↑]          ： 加算処理を実施して次のイベントは抑制
        //   キーコード:40[↓]          ： 減算処理を実施して次のイベントは抑制
        //   キーコード: 8[Back Space]  ： 削除処理を実施して次のイベントは抑制
        //   キーコード:46[DEL]         ： 削除処理を実施して次のイベントは抑制
        //   キーコード: 9[TAB]         ： [SHIFT]無の場合：時→分→秒→次のエレメントの順でフォーカスを移動して次のイベントは抑制
        //                                 [SHIFT]有の場合：秒→分→時→前のエレメントの順でフォーカスを移動して次のイベントは抑制
        //   数値キー                   ： 次のイベントを通常実施
        //   上記以外                   ： 次のイベントは抑制
        //----------------------------------------------------------------------
        onKeyDown: function (e) {
            if (e.keyCode === 38) {
                this.valueUp();
                e.preventDefault();
            }
            else if (e.keyCode === 40) {
                this.valueDown();
                e.preventDefault();
            }
            else if (e.keyCode === 8) {
                this.onDelClick();
                e.preventDefault();
            }
            else if (e.keyCode === 46) {
                this.onDelClick();
                e.preventDefault();
            }
            else if (e.keyCode === 9) {
                if (event.shiftKey) {
                    if (this.editTarget === "second") {
                        this.editTarget = "minute";
                        this.selectEditArea();
                        e.preventDefault();
                    } else if (this.editTarget === "minute") {
                        this.editTarget = "hour";
                        this.selectEditArea();
                        e.preventDefault();
                    }
                }
                else {
                    if (this.editTarget === "hour") {
                        this.editTarget = "minute";
                        this.selectEditArea();
                        e.preventDefault();
                    } else if (this.editTarget === "minute") {
                        if (this.useSecond) {
                            this.editTarget = "second";
                            this.selectEditArea();
                            e.preventDefault();
                        }
                    }
                }
            }
            else if (!isNumber(e.key) && e.key !== 9) {
                e.preventDefault();
            }
        },

        //----------------------------------------------------------------------
        // キー入力イベント処理
        //   数値以外の文字の入力を禁止する(KeyDownで抑制しているので来ないはず)
        //   一桁目で時、分、秒の最大を超える場合は2桁目として扱い、次の分や秒に移動する
        //   この処理内で時分秒の編集は実行し、この後の通常の処理は実行させない
        //----------------------------------------------------------------------
        onKeypress: function (e) {
            if (e.keyCode < 48 || e.keyCode > 57) e.preventDefault();

            // 入力された数値を取得する
            var inputNumber = (e.keyCode - 48).toString();

            if (this.isSecondInput) {
                // 2桁目の入力
                if (this.editTarget === "hour") {
                    this.hour = (this.hour + inputNumber).slice(-2);
                    if (this.muniteStep === 0) {
                        this.minute = "00";
                    }
                    else {
                        this.editTarget = "minute";
                    }
                    this.isSecondInput = false;
                } else if (this.editTarget === "minute") {
                    this.minute = (this.minute + inputNumber).slice(-2);
                    if (this.step < 60) {
                        if (this.secondStep === 0) {
                            this.minute = "00";
                        }
                        else {
                            this.editTarget = "second";
                        }
                    }
                    else {
                        this.editTarget = "hour";
                    }
                    this.isSecondInput = false;
                }
                else {
                    this.second = (this.second + inputNumber).slice(-2);
                    this.editTarget = "hour";
                    this.isSecondInput = false;
                }
            } else {
                if (this.editTarget === "hour") {
                    this.hour = "0" + inputNumber;
                    if (e.keyCode < 51) {
                        this.isSecondInput = true;
                    }
                    else {
                        if (this.muniteStep === 0) {
                            this.minute = "00";
                        }
                        else {
                            this.editTarget = "minute";
                        }
                    }
                } else if (this.editTarget === "minute") {
                    this.minute = "0" + inputNumber;
                    if (e.keyCode < 54) {
                        this.isSecondInput = true;
                    }
                    else {
                        if (this.step < 60) {
                            if (this.secondStep === 0) {
                                this.minute = "00";
                            }
                            else {
                                this.editTarget = "second";
                            }
                        }
                        else {
                            this.editTarget = "hour";
                        }
                    }
                }
                else {
                    this.second = "0" + inputNumber;
                    if (e.keyCode < 54) {
                        this.isSecondInput = true;
                    }
                    else {
                        this.editTarget = "hour";
                    }
                }
            }

            this.updateInput();
            this.selectEditArea();
            e.preventDefault();
        },

        //----------------------------------------------------------------------
        //  削除ボタン（「×」）のマウス押下イベント処理
        //    「-:--:--」に変更して時をフォーカス
        //----------------------------------------------------------------------
        onDelClick: function () {
            this.hour = "--";
            this.minute = "--";
            this.second = "--";
            this.editTarget = "hour";
            this.isSecondInput = false;
            this.updateInput();
            this.selectEditArea();
        },

        //----------------------------------------------------------------------
        //  upボタンのマウス押下イベント処理
        //   加算処理を実施。ボタンが一定時間離されなければ連続して加算する
        //----------------------------------------------------------------------
        onUpMousedown: function (e) {

            // 左ボタン以外は処理をしない
            if (e.button !== 0) return;

            // ボタン押下状態を内部変数に設定
            this.isMouseDown = true;

            // まず加算
            this.valueUp();

            // 押し続けた場合の加算繰り返し処理を定義
            var valueUpCallback = function (me) {

                // タイマーを一旦クリア
                clearTimeout(me.timeoutId);
                me.timeoutId = 0;

                if (me.isMouseDown) {
                    // 加算
                    me.valueUp();

                    // この処理を繰り返す
                    me.timeoutId = setTimeout(valueUpCallback, 100, me);
                }
            };

            // マウスが押されたままなら、加算繰り返し処理を実施
            if (this.isMouseDown) {
                this.timeoutId = setTimeout(valueUpCallback, 300, this);
            }
        },

        //----------------------------------------------------------------------
        //  downボタンのmousedownイベント処理
        //   減算処理を実施。ボタンが一定時間離されなければ連続して減算する
        //----------------------------------------------------------------------
        onDownMousedown: function (e) {

            // 左ボタン以外は処理をしない
            if (e.button !== 0) return;

            // ボタン押下状態を内部変数に設定
            this.isMouseDown = true;

            // まず減算
            this.valueDown();

            // 押し続けた場合の減算繰り返し処理を定義
            var valueDownCallback = function (me) {

                // タイマーを一旦クリア
                clearTimeout(me.timeoutId);
                me.timeoutId = 0;

                if (me.isMouseDown) {
                    // 減算
                    me.valueDown();

                    // この処理を繰り返す
                    me.timeoutId = setTimeout(valueDownCallback, 100, me);
                }
            };

            // マウスが押されたままなら、減算繰り返し処理を実施
            if (this.isMouseDown) {
                this.timeoutId = setTimeout(valueDownCallback, 300, this);
            }
        },

        //----------------------------------------------------------------------
        //  upボタンおよびdownボタンのマウスアップイベントおよびマウス離脱イベント処理（mouseup,mouseleave）
        //   加算や減算の連続処理を終了する
        //----------------------------------------------------------------------
        onMouseup: function (e) {
            if (this.isMouseDown === false) return;

            // 内部変数のマウス押下状態を解除
            this.isMouseDown = false;

            // マウス押下時の連続処理が設定されているなら解除
            if (this.timeoutId !== 0) {
                clearTimeout(this.timeoutId);
                this.timeoutId = 0;
            }
        },

        //----------------------------------------------------------------------
        //  バリデーションでエラーになった場合
        //   必須の場合で必須エラーメッセージが設定されている場合は必須エラーのメッセージを置き換える
        //----------------------------------------------------------------------
        onInvalid: function (e) {
            // 入力必須エラーメッセージの変更（変更した場合は処理終了）
            if (window.requiredMsgChange(this.$refs.MainInput, this.requiredErrMsg)) return;

        },

        //================================================================================
        // 内部処理
        //================================================================================

        //----------------------------------------------------------------------
        //  時、分、秒の値を丸め単位で丸めた数値に変更する
        //----------------------------------------------------------------------
        toTimeNumberStr: function (val, roundStep) {
            if (val % roundStep !== 0) val = roundStep * parseInt(val / roundStep);

            return ("00" + val.toString()).slice(-2);
        },

        //----------------------------------------------------------------------
        //  入力に合わせて表示と隠しinputの値を更新する。同時にバリデーションも実施する
        //----------------------------------------------------------------------
        updateInput: function () {
            var valueIsNull = false;    // 空白かどうかの判定フラグ

            // 時分秒を編集用のinputのテキストに設定する
            if (this.secondStep !== 0) {
                this.$refs.MainInput.value = this.hour + ":" + this.minute + ":" + this.second;
                if (this.hour === "--" && this.minute === "--" && this.second === "--") valueIsNull = true;
            }
            else {
                this.$refs.MainInput.value = this.hour + ":" + this.minute;
                if (this.hour === "--" && this.minute === "--") valueIsNull = true;
            }

            // 時刻が正しく入力されているかのバリデーションと、バインドしている隠しinputの値の更新
            if (isTime(this.$refs.MainInput.value)) {
                // 正しい日付の場合は隠しinputにコピーしてバリデーションを正常にする
                this.$refs.hiddenInput.value = this.$refs.MainInput.value;

                // 刻み幅のチェック
                if (isNumber(this.step)) {
                    if (timeToSeconds(this.$refs.hiddenInput.value) % this.step !== 0) {
                        if (this.stepErrorMessage) {
                            this.$refs.MainInput.setCustomValidity(this.stepErrorMessage);
                        }
                        else {
                            this.$refs.MainInput.setCustomValidity(this.step + "秒間隔の時刻を設定してください。");
                        }
                        return;
                    }
                }

                // 最小と最大の間かどうかの判定
                if (isTime(this.min)) {
                    if (timeCompare(this.min, this.$refs.hiddenInput.value) < 0) {
                        if (this.minErrorMessage) {
                            this.$refs.MainInput.setCustomValidity(this.minErrorMessage);
                        }
                        else {
                            this.$refs.MainInput.setCustomValidity(this.min + "以上の時刻を設定してください。");
                        }
                        return;
                    }
                }
                if (isTime(this.max)) {
                    if (timeCompare(this.max, this.$refs.hiddenInput.value) > 0) {
                        if (this.maxErrorMessage) {
                            this.$refs.MainInput.setCustomValidity(this.maxErrorMessage);
                        }
                        else {
                            this.$refs.MainInput.setCustomValidity(this.max + "以下の時刻を設定してください。");
                        }
                        return;
                    }
                }
                this.$refs.MainInput.setCustomValidity("");
            }
            else {
                this.$refs.hiddenInput.value = "";
                if (valueIsNull) {
                    if (this.required) {
                        if (this.requiredErrMsg) {
                            // 空白で必須の場合はバリデーションエラー
                            this.$refs.MainInput.setCustomValidity(this.requiredErrMsg);
                        }
                        else {
                            // 空白で必須の場合はバリデーションエラー
                            this.$refs.MainInput.setCustomValidity("入力してください。");
                        }
                    }
                    else {
                        // 空白で必須でない場合はバリデーション正常
                        this.$refs.MainInput.setCustomValidity("");
                    }
                }
                else {
                    // 空白ではなく時刻でもない場合はバリデーションエラー
                    this.$refs.MainInput.setCustomValidity("時刻を入力してください。");
                }
            }
        },

        //----------------------------------------------------------------------
        //  カーソル位置とstepから編集対象を時・分・秒のいずれかに設定する
        //----------------------------------------------------------------------
        selectEditTarget: function () {
            if (this.muniteStep === 0) {
                this.editTarget = "hour";   // 時のみ編集可能な場合は常に時を編集状態にする
            }
            else {
                // カーソルエリアに応じて編集対象を設定する
                if (this.$refs.MainInput.selectionStart >= 6) {
                    this.editTarget = "second";
                }
                else if (this.$refs.MainInput.selectionStart >= 3) {
                    this.editTarget = "minute";
                }
                else {
                    this.editTarget = "hour";
                }
            }
        },

        //----------------------------------------------------------------------
        //  編集対象（時・分・秒）に応じた範囲を選択状態にする
        //----------------------------------------------------------------------
        selectEditArea: function () {
            if (this.editTarget === "hour") {
                this.$refs.MainInput.setSelectionRange(0, 2);
            }
            else if (this.editTarget === "minute") {
                this.$refs.MainInput.setSelectionRange(3, 5);
            }
            else if (this.editTarget === "second") {
                this.$refs.MainInput.setSelectionRange(6, 8);
            }
        },

        //----------------------------------------------------------------------
        //  時を加算する
        //   「--」の場合は「00」として扱う
        //   24になれば0にする（ループする）
        //----------------------------------------------------------------------
        addHours: function (hours, roundStep) {
            var newValue = 0;
            if (this.hour !== "--") newValue = Number(this.hour); 

            newValue = newValue + hours;
            if (newValue >= 24) {
                newValue = newValue - 24;
            }
            else if (newValue < 0) {
                newValue = newValue + 24;
            }
            this.hour = this.toTimeNumberStr(newValue, roundStep);
        },

        //----------------------------------------------------------------------
        //  分を加算する
        //   「--」の場合は「00」として扱う
        //   60になれば時を1加算して0にする
        //----------------------------------------------------------------------
        addMinutes: function (minutes, roundStep) {
            if (this.hour === "--") this.hour = "00";
            var newValue = 0;
            if (this.minute !== "--") newValue = Number(this.minute);

            newValue = newValue + minutes;
            if (newValue >= 60) {
                newValue = newValue - 60;
                this.addHours(1, 1);
            } else if (newValue < 0) {
                newValue = newValue + 60;
                this.addHours(-1, 1);
            }

            this.minute = this.toTimeNumberStr(newValue, roundStep);
        },

        //----------------------------------------------------------------------
        //  秒を加算する
        //   「--」の場合は「00」として扱う
        //   60になれば分を1加算して0にする
        //----------------------------------------------------------------------
        addSeconds: function (seconds, roundStep) {
            if (this.hour === "--") this.hour = "00";
            if (this.minute === "--") this.minute = "00";
            var newValue = 0;
            if (this.second !== "--") newValue = Number(this.second); 

            newValue = newValue + seconds;
            if (newValue >= 60) {
                newValue = newValue - 60;
                this.addMinutes(1, 1);
            } else if (newValue < 0) {
                newValue = newValue + 60;
                this.addMinutes(-1, 1);
            }
            this.second = this.toTimeNumberStr(newValue, roundStep);
        },

        //----------------------------------------------------------------------
        //  加算処理
        //   フォーカスに合わせて、時、分、秒のいずれかの加算を行う
        //----------------------------------------------------------------------
        valueUp: function () {
            var newValue = 0;
            if (this.editTarget === "hour") {
                this.addHours(this.hourStep, this.hourStep);
            }
            else if (this.editTarget === "minute") {
                this.addMinutes(this.muniteStep, this.muniteStep);
            }
            else if (this.editTarget === "second") {
                this.addSeconds(this.secondStep, this.secondStep);
            }
            this.updateInput();
            this.selectEditArea();
            this.isSecondInput = false;
        },

        //----------------------------------------------------------------------
        //  減算処理
        //   フォーカスに合わせて、時、分、秒のいずれかの減算を行う
        //----------------------------------------------------------------------
        valueDown: function () {
            var newValue = 0;
            if (this.editTarget === "hour") {
                this.addHours(this.hourStep * -1, this.hourStep);
            }
            else if (this.editTarget === "minute") {
                this.addMinutes(this.muniteStep * -1, this.muniteStep);
            }
            else if (this.editTarget === "second") {
                this.addSeconds(this.secondStep * -1, this.secondStep);
            }
            this.updateInput();
            this.selectEditArea();
            this.isSecondInput = false;
        }
    },
    template: 
        '<span ref="base" display="inline" :style=basSpanStyle > \
            <input type="hidden" :id=id :name=name v-model=value ref="hiddenInput"> \
            <input \
                :id=inputId \
                ref="MainInput" \
                type="text" \
                :style=inputStyle \
                :required=required \
                @focus=onFocus \
                @click=onClick \
                @keydown=onKeyDown \
                @keypress=onKeypress \
                @invalid=onInvalid>\
            <span :style=delButtonStyle>\
                <button type="button" ref="delButton" \
                    :id=deleteId \
                    :style=delButtonStyle \
                    tabIndex = -1 \
                    @click=onDelClick  >×</button>\
            </span> \
            <span :style=buttonSpanStyle>\
                <button type="button" ref="UpButton" \
                    :id=upId \
                    :style=buttonStyle \
                    tabIndex = -1 \
                    @mousedown=onUpMousedown \
                    @mouseleave=onMouseup \
                    @mouseup=onMouseup >▲</button>\
                <button type="button" ref="DownButton" \
                    :id=downId \
                    :style=buttonStyle \
                    tabIndex = -1 \
                    @mousedown=onDownMousedown \
                    @mouseleave=onMouseup \
                    @mouseup=onMouseup >▼</button>\
            </span>\
        </span>'
});

//****************************************************************************************************
//  一般（IE11以外）用コンポーネント
//****************************************************************************************************
Vue.component('vue-time-input-normal', {
    props: {
        id: String,
        name: String,
        value: String,
        required: Boolean,
        requiredErrMsg: String,         // 必須エラーメッセージ
        step: String,                   // ステップ
        stepErrorMessage: String,
        min: String,
        minErrorMessage: String,
        max: String,
        maxErrorMessage: String,
    },
    data: function () {
        return {
            timeValue: this.value
        };
    },
    mounted: function () {
        this.onChange();
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
            this.onChange(e);
        },
        //----------------------------------------------------------------------
        // inputのchangeイベント処理
        //----------------------------------------------------------------------
        onChange: function (e) {

            //  デフォルトのバリデーションエラーが有れば処理終了
            if (window.IsDefaultValidationError(this.$refs.MainInput.validity)) {
                // ここでカスタムエラーを削除
                this.$refs.MainInput.setCustomValidity("");
                return;
            }

            // 最小値エラーが無さそうなので、ここで設定する
            if (isTime(this.min) && isTime(this.timeValue)) {
                if (timeCompare(this.min, this.timeValue) < 0) {
                    if (this.minErrorMessage) {
                        this.$refs.MainInput.setCustomValidity(this.minErrorMessage);
                    }
                    else {
                        this.$refs.MainInput.setCustomValidity(this.min + "以上の時刻を設定してください。");
                    }
                    return;
                }
            }

            // エラーが無いのでカスタムエラーを削除
            this.$refs.MainInput.setCustomValidity("");

        },
        //----------------------------------------------------------------------
        // inputのinvalidイベント処理
        //----------------------------------------------------------------------
        onInvalid: function (e) {
            // 入力必須エラーメッセージの変更（変更した場合は処理終了）
            if (window.requiredMsgChange(this.$refs.MainInput, this.requiredErrMsg)) return;

            // 最大値エラーのメッセージの変更
            if (window.rangeMsgChange(this.$refs.MainInput, this.maxErrorMessage, this.minErrorMessage, this.stepErrorMessage)) return;
        }
    },
    template:
        '<input type="time" ref="MainInput" v-model="timeValue" \
            :id=id \
            :name=name \
            :step=step \
            :max=max \
            :min=min \
            :required=required \
            @keypress=onKeypress \
            @change = onChange \
            @invalid=onInvalid>'
});

//****************************************************************************************************
//  基本コンポーネント
//****************************************************************************************************
Vue.component('vue-time-input', {
    props: {
        id: String,                 // タグのidに設定される文字列
        name: String,               // タグのnameに設定される文字列
        value: String,              // 入力された時刻文字列   
        required: Boolean,          // 必須フラグ
        requiredErrMsg: String,     // 必須エラーメッセージ
        step: {                     // ステップ
            type: String,           //  数値
            default: "60"             //  デフォルト60秒（1分）
        },
        stepErrorMessage: String,   // ステップエラーメッセージ
        min: {                      // 最小時刻
            type: String,           //  文字列
            default: "00:00:00"     //  デフォルト「00:00:00」
        },
        minErrorMessage: String,    // 最小時刻エラーメッセージ
        max: {                      // 最大時刻
            type: String,           //  文字列
            default:"23:59:59"      //  デフォルト「23:59:59」
        },
        maxErrorMessage: String     // 最大時刻エラーメッセージ
    },
    data: function () {
        return {
            elementType: this.getElementType()
        };
    },
    methods: {
        getElementType: function () {
            elementType: if (window.IsBroser("MSIE11")) {
                return "vue-time-input-ie11";
            }
            else {
                return "vue-time-input-normal";
            }
        }
    },
    template:
        '<component v-bind:is=elementType\
             v-model="value" \
            :id=id \
            :name=name \
            :step=step :stepErrorMessage=stepErrorMessage\
            :max=max :maxErrorMessage=maxErrorMessage\
            :min=min :minErrorMessage=minErrorMessage\
            :required=required :requiredErrMsg=requiredErrMsg \
            ></component> '
});