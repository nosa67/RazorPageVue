//======================================================================
// ラジオボタンタグ
// ラジオボタンをグループで設定し、選択されている一つのデータを返す
// VueRadioButtonsTagHelperと連携して利用する
// 使用方法は「VueRadioButtonsTagHelper」を参照
//======================================================================
Vue.component('vue-radio-buttons', {
    props:
    {
        id: String,                 // このコントロールのid。Razor Pageとasp-forで関連付けされている
        name: String,               // このコントロールのname。Razor Pageとasp-forで関連付けされている
        list: String,               // 選択リスト(key,value)のペアのリスト（JSONデータ）値がenum型の場合は列挙の配列で未設定ならすべての列挙
        value: String,              // 選択されている初期値（key）または列挙
        selectedclass: String,      // 選択されているアイテムのcssクラス
        notselectedclass: String,   // 選択されていないアイテムのcssクラス
        required: Boolean,          // 必須フラグ
        requiredErrMsg: String      // 必須エラーメッセージ

    },
    data: function () {
        return {
            selectList: JSON.parse(this.list),      // 選択リスト
            selectedValue: this.value,              // 選択値
            groupName: "items_" + this.name         // 選択ラジオボタンのグループ名

        };
    },
    mounted: function () {
        this.checkRequired();       // マウント時に必須チェックを行う
    },
    methods: {
        //------------------------------------------------------------
        // 選択リストのid作成
        //------------------------------------------------------------
        itemid: function (index) {
            return this.id + '_' + index;
        },
        //------------------------------------------------------------
        // 選択操作。選択アイテムをクリックした時に実行
        //------------------------------------------------------------
        selectAction: function (e) {
            
            if (this.selectedValue === e.target.getAttribute("value")) {
                // 同じものを選択した場合は[cannoselect]が有効な場合は未選択状態にする（valueにnullが可能な場合のみ）
                if (!this.required) {
                    this.selectedValue = "";
                }
            }
            else {
                // 選択値を変更する
                this.selectedValue = e.target.getAttribute("value");
            }

            this.checkRequired();
        },
        //------------------------------------------------------------
        // その値が選択されているかどうか（自身が選択状態かどうかの判定用）
        //------------------------------------------------------------
        isSelected: function (val) {
            return val === this.selectedValue;
        },
        //------------------------------------------------------------
        // 必須チェック
        //------------------------------------------------------------
        checkRequired: function () {
            if (this.required && this.selectedValue === "") {

                // 変更エラーメッセージを取得
                if (this.requiredErrMsg) {
                    // 変更エラーメッセージがある場合は変更エラーメッセージを設定
                    for (let i = 0; i < this.$refs.Items.length; i++) {

                        this.$refs.Items[i].setCustomValidity(this.requiredErrMsg);
                    }
                }
                else {
                    // 変更エラーメッセージが無ければデフォルトのエラーメッセージを設定
                    for (let i = 0; i < this.$refs.Items.length; i++) {

                        this.$refs.Items[i].setCustomValidity("どれか一つ入力してください。");
                    }
                }
            }
            else {
                // エラーが無いのでカスタムエラーを削除
                for (let i = 0; i < this.$refs.Items.length; i++) {

                    this.$refs.Items[i].setCustomValidity("");
                }
            }
        }
    },
    template: '<div>\
                    <input :id=id :name=name type="hidden" :value=selectedValue>\
                    <span v-for="(item, index) in selectList" :key="item.value">\
                        <span style="display:inline-block" :class="[isSelected(item.value) ? selectedclass : notselectedclass ]" :value=item.value>\
                            <input type="radio" ref="Items" :id=itemid(index) :name=groupName :checked=isSelected(item.value) v-on:click=selectAction :value=item.value >\
                            <label v-on:click=selectAction :value=item.value>{{ item.key }}</label>\
                        </span>\
                    </span>\
                </div>'
    
});