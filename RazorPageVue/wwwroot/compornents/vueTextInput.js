Vue.component('vue-text-input', {
    props:
    {
        id: String,                     // id
        name: String,                   // name
        required: String,               // 必須属性
        requiredErrMsg: String,         // 必須エラーメッセージ
        maxlength: Number,              // 文字列の最大長
        maxlengthErrMsg: String,        // 最大長エラーメッセージ     
        minlength: Number,              // 文字列の最小長
        minlengthErrMsg: String,        // 最小長エラーメッセージ     
        compareId: String,              // 同一比較するコンポーネントのID
        compareErrMsg: String,          // 同一比較エラーメッセージ
        typemismatchErrMsg: String,     // 型異常（url,email）のエラーメッセージ
        value: String                   // 入力された値
    },
    data: function (){
        return {
            compareCompornent: null,    // 自信が比較設定している比較対象のコンポーネント
            comparedComponents: [],     // 自信が比較設定されている対象のコンポーネント
            inputText: this.value
        };
    },
    computed:
    {
        // inputタグのtypeに設定する値
        dataType: function () {
            if ((type === "text") || (type === "url") || (type === "email") || (type === "password")) {
                return type;
            }

            return "text";
        }
    },
    methods: {
        //------------------------------------------------------------
        // 入力が変更された場合に各種バリデーションをチェックする
        //------------------------------------------------------------
        onChange: function () {
            //  デフォルトのバリデーションエラーが有れば処理終了
            if (window.IsDefaultValidationError(this.$el.validity)) {
                // ここでカスタムエラーを削除
                this.$el.setCustomValidity("");
                return;
            }

            // 入力必須バリデーション処理
            if (!window.RequiredValidation(this.$el, this.required, this.requiredErrMsg)) return;

            // 入力文字数バリデーション処理
            if (!window.StringLengthValidation(this.$el, this.maxlength, this.maxlengthErrMsg, this.minlength, this.minlengthErrMsg)) return;

            // 比較バリデーション処理
            if (this.compareCompornent) {
                if (!window.CompareValidation(this.$el, this.compareCompornent.inputText, this.compareErrMsg )) return;
            }
            for (var i = 0; i < this.comparedComponents.length; i++) {
                this.comparedComponents[i].onChange();
            }

            // エラーが無いのでカスタムエラーを削除
            this.$el.setCustomValidity("");
        },
        //------------------------------------------------------------
        // バリデーションエラーでメッセージが設定されている場合エラーメッセージを変更する
        //------------------------------------------------------------
        onInvalid: function (e) {
            // 入力必須エラーメッセージの変更（変更した場合は処理終了）
            if (window.requiredMsgChange(this.$el, this.requiredErrMsg)) return;

            // 入力文字数エラーメッセージの変更
            if (stringLengthMsgChange(this.$el, this.maxlengthErrMsg, this.minlengthErrMsg)) return;

            // 型異常(URL,Email)エラーメッセージの変更
            if (typeMismatchMsgChange(this.$el, this.typemismatchErrMsg)) return;
        }
    },
    mounted: function () {
        // 比較対象が設定されている場合、比較対象コンポーネントと相互に関連付けを行う
        if (this.compareId) {
            for (var j = 0; j < this.$root.$children.length; j++) {
                var targetItem = this.$root.$children[j];
                if (this.compareId === targetItem.$el.id) {
                    this.compareCompornent = targetItem;
                    targetItem.comparedComponents.push(this);
                }
            }
        }

        // バリデーションを実施させる
        this.onChange();
    },
    template: '<input :id=id :name=name type=dataType() v-model="inputText" \
        :required=required \
        :maxlength=maxlength \
        :minlength=minlength \
        @change=onChange @invalid=onInvalid>'
});