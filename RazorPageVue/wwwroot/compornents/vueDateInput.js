//****************************************************************************************************
//  IE11用コンポーネント
//****************************************************************************************************
Vue.component('vue-date-input-ie11', {
    props:
    {
        id: String,                     // id
        name: String,                   // name
        value: String,                   // 入力された値
        required: Boolean,
        requiredErrMsg: String,         // 必須エラーメッセージ
        buttonWidth: {
            type: Number,
            default: 30
        }
    },
    data: function () {
        return {
            editTarget: "none", // none,year,month,dayのいずれか
            editLevel: 0,       // 入力中の処理中の桁数、0,1,2,3のいずれか（2,3はyearのみ）
            year:"",            // 入力されている年
            month:"",           // 入力されている月
            day: "",            // 入力されている日
            modal: false,       // モーダルダイアログ表示フラグ（これがセットされるとカレンダーダイアログが表示される(v-ifを利用)）
            dialogYear: 0,      // カレンダーダイアログで表示中の年
            dialogMont: 0,      // カレンダーダイアログで表示中の月
            weekList:[],        // カレンダー用の週リスト
            //--------------------------------------------------
            // 各パーツのスタイル
            //--------------------------------------------------
            basSpanStyle: {                 // 全体のスタイル
                padding: 0,
                margin: 0,
                border: "solid thin",
                display: "inline-flex"
            },
            inputStyle: {                   // 入力エリアのスタイル
                margin: 0,
                border: 0,
                textAlign: "center",
                width: "6em"
            },
            delButtonStyle: {               // 削除ボタンのスタイル
                margin: 0,
                border: 0,
                background: "transparent",
                width: "1.5em"
            },
            buttonSpanStyle: {              // カレンダーボタンの外側のスタイル
                border: "solid 1px black",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column"
            },
            buttonStyle: {                  // カレンダーボタンのスタイ
                border: 0,
                padding: 0,
                margin: 0,
                width: "1.5em"
            },
            modalOverlay: {                 // モーダルダイアログ表示中の背景マスク用のスタイル 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                zIndex: "30",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)"
            },
            modalWindow: {                  // カレンダーダイアログのウィンドウのスタイル
                background: "#fff",
                borderRadius: "4px",
                overflow: "hidden",
                height: "23.5em",
                border: "double 3px gray",
                position:"static"
            },
            calendarTitleStyle: {           // カレンダーダイアログのの曜日タイトル部のスタイル
                margin: "0",
                padding: "0"
            },
            sundayStyle: {                  // カレンダーダイアログの日曜日の日の表示スタイル
                color: "red",
                margin: "0",
                padding: "0",
                cursor: "pointer"
            },
            saturdayStyle: {                // カレンダーダイアログの土曜日の日の表示スタイル
                color: "blue",
                margin: "0",
                padding: "0",
                cursor: "pointer"
            },
            weekdayStyle: {                 // カレンダーダイアログの平日の表示スタイル
                color: "black",
                margin: "0",
                padding: "0",
                cursor: "pointer"
            },
            yearMonthStyle: {               // カレンダーダイアログの年と月の表示スタイル
                textAlign: "center",
                margin: "0",
                padding: "0"

            },
            dialogButtonStyle: {            // カレンダーダイアログのボタンのスタイル
                border: "solid 1px black",
                borderRadius: "3px",
                padding: "2px"
            },
            dialogCalenderStyle: {          // カレンダーダイアログのカレンダー部のスタイル
                height:"21em"
            },
            dialogFooterStyle: {            // カレンダーダイアログのフッター部分のスタイル
                width: "100%",
                backgroundColor: "#89c7de",
                color: "#fff",
                textAlign: "right",
                padding: "3px",
            },
            dialogPrevButtonCellStyle: {    // カレンダーダイアログの前の年（または月）ボタンが入るセルのスタイル
                margin: "0",
                padding: "4px 2px 2px 2px",
                textAlign: "right"
            },
            dialogPostButtonCellStyle: {    // カレンダーダイアログの次の年（または月）ボタンが入るセルのスタイル
                margin: "0",
                padding: "4px 2px 2px 2px"
            }
        };

    },
    //================================================================================
    // コンポーネントマウント時の処理
    //================================================================================
    mounted: function () {

        // valueの値を編集用のyear,month,dayに分割する
        if (isDate(this.value)) {
            var dateItems = this.value.split("/");
            this.year = dateItems[0];
            this.month = dateItems[1];
            this.day = dateItems[2];
        }

        // 初期値の調整
        this.updateInput();
    },
    computed:
    {
        inputId: function () {
            return "input_" + this.id;
        },
        deleteId: function () {
            return "del_" + this.id;
        },
        dialogId: function () {
            return "dialog_" + this.id;
        },
        prevYearId: function () {
            return "prev_year_" + this.id;
        },
        postYearId: function () {
            return "post_year_" + this.id;
        },
        prevMonthId: function () {
            return "prev_month_" + this.id;
        },
        postMonthId: function () {
            return "post_month_" + this.id;
        },
        tableId: function () {
            return "table_" + this.id;
        },
        closeDialogId: function () {
            return "close_dialog_" + this.id;
        }
    },
    methods: {
        //================================================================================
        // イベントハンドラ
        //================================================================================
        onClick: function () {
            this.selectEditTarget();
            this.selectEditArea();
        },

        //----------------------------------------------------------------------
        // キー入力イベント処理
        // 数値以外の文字の入力を禁止する
        // ただし貼り付けには対応していないので必要なら追加すること
        //----------------------------------------------------------------------
        onKeypress: function (e) {

            // 48～57:数値以外の入力を禁止
            if (e.keyCode < 48 || e.keyCode > 57) e.preventDefault();

            // 入力された数値を取得する
            var inputNumber = e.keyCode - 48;
            if (this.editTarget === "year") {
                // 年の場合の処理
                if (this.editLevel === 0) {
                    // 1桁目の場合
                    this.year = inputNumber;
                    this.editLevel = 1;
                }
                else {
                    // 2桁目以降の場合（先の入力を10倍して加算する）
                    this.year = this.year * 10 + inputNumber;
                    this.editLevel = this.editLevel + 1;
                    if (this.editLevel >= 4) {
                        this.editTarget = "month";
                        this.editLevel = 0;
                    }
                }
            } else if (this.editTarget === "month") {
                // 月の場合の処理
                if (this.editLevel === 0) {
                    // 1桁目の場合
                    this.month = inputNumber;
                    if (inputNumber <= 1) {
                        this.month = inputNumber;
                        // 入力が１の場合のみ2桁目とする（20以上の月は無いので）
                        this.editLevel = 1;
                    }
                    else {
                        this.editTarget = "day";
                        this.editLevel = 0;
                    }
                }
                else {
                    // 2桁目は1桁目が1の場合は3未満しか許容しない（12月までしかないから）
                    if (this.month === 0 || inputNumber < 3) {
                        this.month = this.month * 10 + inputNumber;
                        this.editTarget = "day";
                        this.editLevel = 0;
                    }
                }
            }
            else {
                // 日の場合の処理
                if (this.editLevel === 0) {
                    // 1桁目の場合
                    if (inputNumber <= 3) {
                        this.day = inputNumber;
                        // 入力が3以下の場合のみ2桁目とする（40以上の日は無いので）
                        this.editLevel = 1;
                    }
                    else {
                        this.editTarget = "year";
                        this.editLevel = 0;
                    }
                }
                else {
                    // 2桁目の場合は月の最終日以上の場合は入力を許容しない
                    var monthLastDay = 31;
                    if (this.year && this.month) {
                        monthLastDay = getMonthLastDay(new Date(this.year, this.month, 1));
                    }
                    if (this.day * 10 + inputNumber <= monthLastDay) {
                        this.day = this.day * 10 + inputNumber;
                        this.editTarget = "year";
                        this.editLevel = 0;
                    }
                }
            }
            this.updateInput();         // 入力内容の確認とバリデーション
            this.selectEditArea();      // 入力中の年、月、日の選択状態を設定
            e.preventDefault();         // 以降のイベント処理を実施させない
        },

        //----------------------------------------------------------------------
        // キー押下イベント処理
        //----------------------------------------------------------------------
        onKeyDown: function (e) {
            if (e.keyCode === 38) {
                // 「↑」(code=38)の場合
                this.valueUp();
                e.preventDefault();
            }
            else if (e.keyCode === 40) {
                // 「↓」(code=40)の場合
                this.valueDown();
                e.preventDefault();
            }
            else if (e.keyCode === 8) {
                // 「BACK SPACE」(code=8)の場合
                this.onDelClick();
                e.preventDefault();
            }
            else if (e.keyCode === 46) {
                // 「DEL」(code=46)の場合
                this.onDelClick();
                e.preventDefault();
            }
            else if (e.keyCode === 9) {
                // 「tab」(code=9)の場合
                if (event.shiftKey) {
                    // shiftキーが押されれている場合、日→月、月→年の入力に変更
                    if (this.editTarget === "day") {
                        this.editTarget = "month";
                        this.selectEditArea();
                        e.preventDefault();
                    } else if (this.editTarget === "month") {
                        this.editTarget = "year";
                        this.selectEditArea();
                        e.preventDefault();
                    }
                }
                else {
                    // shiftキーが押されれていない場合、年→月、月→日の入力に変更
                    if (this.editTarget === "year") {
                        this.editTarget = "month";
                        this.selectEditArea();
                        e.preventDefault();
                    } else if (this.editTarget === "month") {
                        this.editTarget = "day";
                        this.selectEditArea();
                        e.preventDefault();
                    }
                }
            }
            else if (!isNumber(e.key) && e.key !== 9) {
                // 数値でもタブキーでもない場合は以降のイベント処理を中止
                e.preventDefault();
            }
        },
        //----------------------------------------------------------------------
        //  削除ボタン（「×」）のマウス押下イベント処理
        //----------------------------------------------------------------------
        onDelClick: function () {
            // 年月日のクリア
            this.year = "";
            this.month = "";
            this.day = "";
            // 入力を年の1桁目に
            this.editTarget = "year";
            this.editLevel = 0;
            // 入力内容の確認とバリデーション
            this.updateInput();
            // 入力中の年、月、日の選択状態を設定
            this.selectEditArea();
        },
        //----------------------------------------------------------------------
        //  フォーカスイベント処理
        //----------------------------------------------------------------------
        onFocus: function () {
            // 選択された入力範囲（年、月、日のいずれか）を判定し、該当エリアを選択城他人する
            this.selectEditTarget();
            this.selectEditArea();

            // 入力を1桁目に設定
            editLevel = 0;
        },
        //----------------------------------------------------------------------
        //  バリデーションエラー発生イベント処理
        //----------------------------------------------------------------------
        onInvalid: function (e) {
            // 入力必須エラーメッセージの変更（変更した場合は処理終了）
            if (window.requiredMsgChange(this.$refs.MainInput, this.requiredErrMsg)) return;

        },
        //----------------------------------------------------------------------
        //  カレンダーボタン（エリアの右の下「▼」）クリック
        //----------------------------------------------------------------------
        openDateDialog: function () {

            if (isNumber(this.year) && isNumber(this.month)) {
                this.dialogYear = this.year;
                this.dialogMonth = this.month;
            } else {
                var today = new Date();
                this.dialogYear = today.getFullYear();
                this.dialogMonth = today.getMonth() + 1;
            }

            this.setMonth();

            this.modal = true;
        },
        //----------------------------------------------------------------------
        //  カレンダーダイアログの閉じるボタンクリック
        //----------------------------------------------------------------------
        closeDateDialog: function (e) {
            this.modal = false;
            e.preventDefault();
        },
        //----------------------------------------------------------------------
        //  カレンダーダイアログの前の年ボタン（年の左の「＜」）クリック
        //----------------------------------------------------------------------
        prevYear: function (e) {
            if (this.dialogYear >= 1) {
                this.dialogYear -= 1;
                this.setMonth();
            }
        },
        //----------------------------------------------------------------------
        //  カレンダーダイアログの次の年ボタン（年の左の「＞」）クリック
        //----------------------------------------------------------------------
        postYear: function (e) {
            if (this.dialogYear <= 9998) {
                this.dialogYear += 1;
                this.setMonth();
            }
        },
        //----------------------------------------------------------------------
        //  カレンダーダイアログの前の月ボタン（月の左の「＜」）クリック
        //----------------------------------------------------------------------
        prevMonth: function (e) {
            if (this.dialogMonth <= 1) {
                if (this.dialogYear >= 1) {
                    this.dialogMonth = 12;
                    this.dialogYear--;
                }
            }
            else {
                this.dialogMonth -= 1;
            }
            this.setMonth();
        },
        //----------------------------------------------------------------------
        //  カレンダーダイアログの次の月ボタン（月の左の「＞」）クリック
        //----------------------------------------------------------------------
        postMonth: function (e) {
            if (this.dialogMonth <= 11) {
                this.dialogMonth += 1;
                this.setMonth();
            }
            else {
                if (this.dialogYear <= 9998) {
                    this.dialogMonth = 1;
                    this.dialogYear += 1;
                    this.setMonth();
                }
            }
        },
        //----------------------------------------------------------------------
        //  カレンダーダイアログで特定の日をクリック
        //----------------------------------------------------------------------
        selectDay: function (day) {
            if (day) {
                this.year = this.dialogYear;
                this.month = this.dialogMonth;
                this.day = day;
                this.updateInput();
                this.modal = false;
            }
        },

        //================================================================================
        // 内部処理
        //================================================================================

        //----------------------------------------------------------------------
        //  入力に合わせて表示と隠しinputの値を更新する。同時にバリデーションも実施する
        //----------------------------------------------------------------------
        updateInput: function () {
            // 年月日が入っている場合は月の最終日を超えていないかチェックして補正
            if (this.year && this.month && this.day) {
                var monthLast = getMonthLastDay(new Date(this.year, this.month, 1));
                if (this.day > monthLast) this.day = monthLast;
            }

            // 年月日を編集用のinputのテキストに設定する
            var displayValue = "";
            if (this.year || this.year === 0) {
                displayValue = numberToFixLengthString(this.year, "0000");
            }
            else {
                displayValue = "yyyy";
            }
            if (this.month || this.month === 0) {
                displayValue += "/" + numberToFixLengthString(this.month, "00");
            }
            else {
                displayValue += "/mm";
            }
            if (this.day || this.day === 0) {
                displayValue += "/" + numberToFixLengthString(this.day, "00");
            }
            else {
                displayValue += "/dd";
            }
            this.$refs.MainInput.value = displayValue;

            // 全てからの場合は空として処理
            if (!this.year && !this.month && !this.day) {
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
                this.$refs.hiddenInput.value = "";
            }
            else {
                if (isDate(this.$refs.MainInput.value)) {
                    // 正しい日付の場合は隠しinputにコピーしてバリデーションを正常にする
                    this.$refs.hiddenInput.value = this.$refs.MainInput.value;
                    this.$refs.MainInput.setCustomValidity("");
                }
                else {
                    // 日付が異常な場合は隠しinputは空にしてカスタムエラーメッセージを設定
                    this.$refs.hiddenInput.value = "";
                    this.$refs.MainInput.setCustomValidity("日付が正しくありません。");
                }
            }
        },
        //----------------------------------------------------------------------
        //  カーソル位置とstepから編集対象を時・分・秒のいずれかに設定する
        //----------------------------------------------------------------------
        selectEditTarget: function () {
            // カーソルエリアに応じて編集対象を設定する
            if (this.$refs.MainInput.selectionStart >= 8) {
                this.editTarget = "day";
            }
            else if (this.$refs.MainInput.selectionStart >= 5) {
                this.editTarget = "month";
            }
            else {
                this.editTarget = "year";
            }
        },
        //----------------------------------------------------------------------
        //  編集対象（時・分・秒）に応じた範囲を選択状態にする
        //----------------------------------------------------------------------
        selectEditArea: function () {
            if (this.editTarget === "year") {
                this.$refs.MainInput.setSelectionRange(0, 4);
            }
            else if (this.editTarget === "month") {
                this.$refs.MainInput.setSelectionRange(5, 7);
            }
            else if (this.editTarget === "day") {
                this.$refs.MainInput.setSelectionRange(8, 10);
            }
        },
        //----------------------------------------------------------------------
        //  年の加算
        //----------------------------------------------------------------------
        addYear: function (addValue) {
            if (isNumber(this.year)) {
                this.year = Number(this.year) + addValue;
                while (this.year < 1) this.year += 9999;
                while (this.year > 9999) this.year -= 9999;
            }
            else {
                this.year = (new Date()).getFullYear();
            }
        },
        //----------------------------------------------------------------------
        //  月の加算
        //----------------------------------------------------------------------
      addMonth: function (addValue) {
            if (isNumber(this.month)) {
                this.month = Number(this.month) + addValue;
                while (this.month < 1) this.month += 12;
                while (this.month > 12) this.month -= 12;
            }
            else {
                this.month = (new Date()).getMonth() + 1;
            }
        },
        //----------------------------------------------------------------------
        //  日の加算
        //----------------------------------------------------------------------
        addDay: function (addValue) {
            if (isNumber(this.day)) {
                var monthLast = 31;
                if (isDate(this.year.toString() + "/" + this.month.toString() + "/1")) {
                    monthLast = getMonthLastDay(new Date(this.year, this.month, 1));
                }

                this.day = Number(this.day) + addValue;
                while (this.day < 1) this.day += monthLast;
                while (this.day > monthLast) this.day -= monthLast;
            }
            else {
                this.day = (new Date()).getDay();
            }
        },
        //----------------------------------------------------------------------
        //  加算処理（矢印キーの上を押したときの処理）
        //----------------------------------------------------------------------
        valueUp: function () {
            var newValue = 0;
            if (this.editTarget === "year") {
                this.addYear(1);
            }
            else if (this.editTarget === "month") {
                this.addMonth(1);
            }
            else if (this.editTarget === "day") {
                this.addDay(1);
            }
            this.updateInput();
            this.selectEditArea();
        },
        //----------------------------------------------------------------------
        //  減算処理（矢印キー下を押したときの処理）
        //----------------------------------------------------------------------
        valueDown: function () {
            var newValue = 0;
            if (this.editTarget === "year") {
                this.addYear(-1);
            }
            else if (this.editTarget === "month") {
                this.addMonth(-1);
            }
            else if (this.editTarget === "day") {
                this.addDay(-1);
            }
            this.updateInput();
            this.selectEditArea();
        },
        //----------------------------------------------------------------------
        //  カレンダーダイアログの月のカレンダーを表示する
        //----------------------------------------------------------------------
        setMonth: function () {
            var targetMonthFirst = new Date(this.dialogYear, this.dialogMonth - 1, 1);
            var targetMonthLast = new Date(this.dialogYear, this.dialogMonth, 0);
            var today = new Date();
            var todayDay = today.getDate();
            if (this.dialogYear !== today.getFullYear() || (this.dialogMonth - 1) !== today.getMonth()) todayDay = -1;

            this.weekList = [];
            var oneWeek = [];
            var index = 0;
            for (var day = (1 - targetMonthFirst.getDay()); day <= targetMonthLast.getDate(); day++) {
                var dayColor = "black";
                if ((index % 7) === 0) {
                    dayColor = "red";
                }
                else if ((index % 7) === 6) {
                    dayColor = "blue";
                }
                if (day > 0) {
                    var item = {
                        index: index,
                        day: day,
                        addStyle: { color: dayColor }
                    };
                    if (todayDay === day) item.addStyle.fontWeight = "bold";
                    oneWeek.push(item);
                }
                else {
                    var item2 = {
                        index: index,
                        day: "",
                        addStyle: { color: dayColor }
                    };
                    oneWeek.push(item2);
                }

                if (oneWeek.length === 7) {
                    this.weekList.push(oneWeek);
                    oneWeek = [];
                }
                index = index + 1;
            }
            this.weekList.push(oneWeek);
        }
    },
    template:
        '<span ref="base" display="inline" :style=basSpanStyle > \
            <input type="hidden" :id=id :name=name ref="hiddenInput"> \
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
                <button type="button" ref="calendarButton" \
                    :id=dialogId \
                    :style=buttonStyle \
                    @click=openDateDialog \
                    tabIndex = -1 >▼</button>\
            </span>\
            <div :style=modalOverlay @click.self=closeDateDialog v-if="modal"> \
                <div :style=modalWindow > \
                    <div :style=dialogCalenderStyle> \
                        <table :id=tableId style="margin:0;padding:0"> \
                            <tr style="margin:0;padding:0;"> \
                                <td colspan=2 :style=dialogPrevButtonCellStyle><span :id=prevYearId :style=dialogButtonStyle @click=prevYear >＜</span></td> \
                                <td colspan=3 :style=yearMonthStyle> {{dialogYear}}年 </td> \
                                <td colspan=2 :style=dialogPostButtonCellStyle><span :id=postYearId :style=dialogButtonStyle @click=postYear >＞</span></td> \
                            </tr> \
                            <tr> \
                                <td colspan=2 :style=dialogPrevButtonCellStyle><span :id=prevMonthId :style=dialogButtonStyle @click=prevMonth>＜</span></td> \
                                <td colspan=3 :style=yearMonthStyle> {{dialogMonth}}月</td> \
                                <td colspan=2 :style=dialogPostButtonCellStyle><span :id=postMonthId :style=dialogButtonStyle @click=postMonth>＞</span></td> \
                            </tr> \
                            <tr> \
                                <td :style=calendarTitleStyle style="color:red">日</td> \
                                <td :style=calendarTitleStyle>月</td> \
                                <td :style=calendarTitleStyle>火</td> \
                                <td :style=calendarTitleStyle>水</td> \
                                <td :style=calendarTitleStyle>木</td> \
                                <td :style=calendarTitleStyle>金</td> \
                                <td :style=calendarTitleStyle style="color:blue">土</td> \
                            </tr> \
                            <tr v-for="testRow in weekList"> \
                                <td v-for="item in testRow" :style=item.addStyle @click="selectDay(item.day)"><span>{{item.day}}</span></td> \
                            </tr> \
                        </table> \
                    </div> \
                    <footer :style=dialogFooterStyle> \
                        <button :id=closeDialogId @click=closeDateDialog >中止</button > \
                    </footer> \
                </div > \
            </div > \
        </span>'
    });


//****************************************************************************************************
//  一般（IE11以外）用コンポーネント
//****************************************************************************************************
Vue.component('vue-date-input-normal', {
    props: {
        id: String,
        name: String,
        value: String,
        required: Boolean,
        requiredErrMsg: String,         // 必須エラーメッセージ
    },
    methods: {
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

            // エラーが無いのでカスタムエラーを削除
            this.$refs.MainInput.setCustomValidity("");
        },
        //----------------------------------------------------------------------
        // inputのinvalidイベント処理
        //----------------------------------------------------------------------
        onInvalid: function (e) {
            // 入力必須エラーメッセージの変更（変更した場合は処理終了）
            if (window.requiredMsgChange(this.$refs.MainInput, this.requiredErrMsg)) return;
        }
    },
    template:
        '<input type="date" ref="MainInput" v-model="value" \
            :id=id \
            :name=name \
            :required=required \
            @change=onChange \
            @invalid=onInvalid>'
});

//****************************************************************************************************
//  基本コンポーネント
//****************************************************************************************************
Vue.component('vue-date-input', {
    props: {
        id: String,
        name: String,
        value: String,
        required: Boolean,
        requiredErrMsg: String,
        buttonWidth: {
            type: Number,
            default: 30
        }
    },
    data: function () {
        return {
            elementType: this.getElementType()
        };
    },
    methods: {
        getElementType: function () {
            elementType: if (window.IsBroser("MSIE11")) {
                return "vue-date-input-ie11";
            }
            else {
                return "vue-date-input-normal";
            }
        }
    },
    template:
        '<component v-bind:is=elementType\
            v-model="value" \
            :id=id \
            :name=name \
            :required=required :requiredErrMsg=requiredErrMsg \
            :buttonWidth=buttonWidth></component> '
});