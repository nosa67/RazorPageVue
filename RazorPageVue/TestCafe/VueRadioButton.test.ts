import "testcafe";
import {Selector} from "testcafe";
import { ClientFunction } from "testcafe";

fixture("Vue ラジオボタンコンポーネントテスト")
    .page("https://localhost:44357/RadioButton");

//================================================================================
// クライアント処理
//================================================================================

//--------------------------------------------------------------------------------
//  入力エレメントのバリデーションフラグを取得する
//  【引数】
//      id      ：入力エレメントid
//  【返値】
//      入力エレメントのバリデーションフラグ(true:正常、false:エラー有)
//--------------------------------------------------------------------------------
const getInputValidity = ClientFunction((id) => {
    return (document.getElementById(id) as HTMLInputElement).checkValidity();
});

//--------------------------------------------------------------------------------
//  入力エレメントのバリデーションメッセージを取得する
//  【引数】
//      id      ：入力エレメントid
//  【返値】
//      入力エレメントのバリデーションメッセージ
//--------------------------------------------------------------------------------
const getValidationMessage = ClientFunction((id) => {
    return (document.getElementById(id) as HTMLInputElement).validationMessage;
});

//================================================================================
// 共通処理
//================================================================================

//----------------------------------------------------------------------
//  バリデーション正常チェック
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkValid(t, id, count) {
    for (let i = 0; i < count; i++) {
        const itemid = id + '_' + i;
        await t.expect(getInputValidity(itemid)).eql(true);
        await t.expect(getValidationMessage(itemid)).eql("");
    }
}

//----------------------------------------------------------------------
//  バリデーション異常チェック（通常メッセージ）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkInvalidMessageNoChange(t, id, count) {
    for (let i = 0; i < count; i++) {
        const itemid = id + '_' + i;
        await t.expect(getInputValidity(itemid)).eql(false);
        const elementMessage = getValidationMessage(itemid);
        await t.expect(elementMessage).notEql("");
        await t.expect(elementMessage).notEql(null);
        await t.expect(elementMessage).notContains("変更");
    }
}

//----------------------------------------------------------------------
//  バリデーション異常チェック（変更メッセージ）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkInvalidMessageChange(t, id, count) {
    for (let i = 0; i < count; i++) {
        const itemid = id + '_' + i;
        await t.expect(getInputValidity(itemid)).eql(false);
        await t.expect(getValidationMessage(itemid)).contains("変更");
    }
}

//----------------------------------------------------------------------
//  全てのチェックボックスで先頭のエレメントをクリックする
//  【変数】
//      t       ：テストコンポーネント
//----------------------------------------------------------------------
async function setDefatltNoErr(t) {
    await t.click(Selector("#BindData_RadioRequiredSelected_0"));
    await t.click(Selector("#BindData_RadioRequiredSelectedErrChange_0"));
    await t.click(Selector("#BindData_EnumRequiredRadioSelected_0"));
    await t.click(Selector("#BindData_EnumRequiredRadioSelectedErrChange_0"));
}

//----------------------------------------------------------------------
//  通常のラジオボタンの選択結果をチェックする
//  【変数】
//      t       ：テストコンポーネント
//      id      ：結果コンポーネントid
//      val     ：選択した値
//      text    ：選択した値の表示テキスト表示
//----------------------------------------------------------------------
async function checkNormalResult(t, id, val, text) {
    await t.expect(Selector(id).find("span").nth(0).textContent).eql(val);
    await t.expect(Selector(id).find("span").nth(1).textContent).eql(text);
}

//----------------------------------------------------------------------
//  Enumタイプのラジオボタンの結果をチェックする
//  【変数】
//      t       ：テストコンポーネント
//      id      ：結果コンポーネントid
//      val     ：選択した値
//      text    ：選択した値の表示テキスト表示
//----------------------------------------------------------------------
async function checkEnumResult(t, id, val) {
    await t.expect(Selector(id).find("span").nth(0).textContent).eql(val);
}

//================================================================================
// テスト
//================================================================================

//----------------------------------------------------------------------
// 初期状態および入力必須テスト
//----------------------------------------------------------------------
test("初期状態および入力必須テスト", async (t) => {

    await t.click(Selector("#mainsubmit"));

    await checkValid(t, "BindData_RadioSelected",5);
    await checkInvalidMessageNoChange(t, "BindData_RadioRequiredSelected", 5);
    await checkInvalidMessageChange(t, "BindData_RadioRequiredSelectedErrChange", 5);
    await checkValid(t, "BindData_EnumRadioSelected", 4);
    await checkInvalidMessageNoChange(t, "BindData_EnumRequiredRadioSelected", 4);
    await checkInvalidMessageChange(t, "BindData_EnumRequiredRadioSelectedErrChange", 4);

    await setDefatltNoErr(t);

    await t.click(Selector("#mainsubmit"));

    await checkNormalResult(t, "#normal-radio-result", "2", "第2項目");
    await checkNormalResult(t, "#required-radio-result", "1", "第1項目");
    await checkEnumResult(t, "#enum-radio-result", "sample2");
    await checkEnumResult(t, "#required-enum-radio-result", "sample1");
});

//----------------------------------------------------------------------
// 通常ラジオボタンテスト
//----------------------------------------------------------------------
test("通常ラジオボタンテスト", async (t) => {

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioSelected_0"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#normal-radio-result", "1", "第1項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioSelected_1"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#normal-radio-result", "", "");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioSelected_2"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#normal-radio-result", "3", "第3項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioSelected_3"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#normal-radio-result", "4", "第4項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioSelected_4"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#normal-radio-result", "5", "最終項目");
});

//----------------------------------------------------------------------
// 必須ラジオボタンテスト
//----------------------------------------------------------------------
test("必須ラジオボタンテスト", async (t) => {
    await setDefatltNoErr(t);

    await t.click(Selector("#BindData_RadioRequiredSelected_0"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#required-radio-result", "1", "第1項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioRequiredSelected_1"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#required-radio-result", "2", "第2項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioRequiredSelected_2"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#required-radio-result", "3", "第3項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioRequiredSelected_3"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#required-radio-result", "4", "第4項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_RadioRequiredSelected_4"));
    await t.click(Selector("#mainsubmit"));
    await checkNormalResult(t, "#required-radio-result", "5", "最終項目");
    await t.click(Selector("#returnLink"));
});

//----------------------------------------------------------------------
// Enumラジオボタンテスト
//----------------------------------------------------------------------
test("Enumラジオボタンテスト", async (t) => {
    await setDefatltNoErr(t);

    await t.click(Selector("#BindData_EnumRadioSelected_0"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#enum-radio-result", "sample1");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_EnumRadioSelected_1"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#enum-radio-result", "");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_EnumRadioSelected_2"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#enum-radio-result", "sample3");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_EnumRadioSelected_3"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#enum-radio-result", "sampleOther");
});

//----------------------------------------------------------------------
// 必須Enumラジオボタンテスト
//----------------------------------------------------------------------
test("必須Enumラジオボタンテスト", async (t) => {
    await setDefatltNoErr(t);

    await t.click(Selector("#BindData_EnumRequiredRadioSelected_0"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#required-enum-radio-result", "sample1");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_EnumRequiredRadioSelected_1"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#required-enum-radio-result", "sample2");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_EnumRequiredRadioSelected_2"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#required-enum-radio-result", "sample3");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_EnumRequiredRadioSelected_3"));
    await t.click(Selector("#mainsubmit"));
    await checkEnumResult(t, "#required-enum-radio-result", "sampleOther");
});