//======================================================================
// チェックボタンタグ
// チェックボタンをグループで設定し、選択されている一つのデータを返す
// VueCheckButtonsTagHelperと連携して利用する
// 使用方法は「VueCheckButtonsTagHelper」を参照
//======================================================================
Vue.component('vue-check-buttons', {
    props:
    {
        id: String,                 // このコントロールのid。Razor Pageとasp-forで関連付けされている
        name: String,               // このコントロールのname。Razor Pageとasp-forで関連付けされている
        list: String,               // 選択リスト(key,value)のペアのリスト（JSONデータ）値がenum型の場合は列挙の配列で未設定ならすべての列挙
        value: String,              // 選択されている項目のvalueの配列（JSONデータ）値が列挙の場合は列挙の配列
        selectedclass: String,      // 選択されているチェックボックスのcssクラス
        notselectedclass: String,   // 選択されていないチェックボックスのcssクラス
        required: Boolean,          // 必須フラグ
        requiredErrMsg: String      // 必須エラーメッセージ
    },
    data: function () {
        return {
            selectlist: JSON.parse(this.list),              // 選択リスト
            selectedValues: JSON.parse(this.value),         // 選択されている値のリスト
            groupName: "items_" + this.name                 // 選択チェックボックスのグループ名
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
            var val = e.target.getAttribute("value");
            var exitIndex = this.selectedValues.indexOf(val);
            if (exitIndex >= 0) {
                this.selectedValues.splice(exitIndex, 1);
            }
            else {
                this.selectedValues.push(val);
            }
            this.checkRequired();
        },
        //------------------------------------------------------------
        // その値が選択されているかどうか（自身が選択状態かどうかの判定用）
        //------------------------------------------------------------
        isSelected: function (val) {
            return this.selectedValues.indexOf(val) >= 0;
        },
        //------------------------------------------------------------
        // 必須チェック
        //------------------------------------------------------------
        checkRequired: function () {
            if (this.required && this.selectedValues.length === 0) {

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
        }    },
    template: '<div :id=id>\
                    <input :name=name v-for="selected in selectedValues" :key=selected type="hidden" :value=selected>\
                    <span v-for="(item, index) in selectlist" :key="item.key">\
                        <span style="display:inline-block" :class="[isSelected(item.value) ? selectedclass : notselectedclass ]" :value=item.value>\
                            <input type="checkbox" ref="Items" :id=itemid(index) :name="groupName" :checked=isSelected(item.value) v-on:click=selectAction :value=item.value >\
                            <label v-on:click=selectAction :value=item.value>{{ item.key }}</label>\
                        </span>\
                    </span>\
                </div>'

});