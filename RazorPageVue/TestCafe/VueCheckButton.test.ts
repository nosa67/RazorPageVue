import "testcafe";
import {Selector} from "testcafe";
import { ClientFunction } from "testcafe";

fixture("Vue チェックボタンコンポーネントテスト")
    .page("https://localhost:44357/CheckButton");

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
//      count   ：チェックボタンの個数
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
//      count   ：チェックボタンの個数
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
//      count   ：チェックボタンの個数
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
    await t.click(Selector("#BindData_RequiredCheckList_0"));
    await t.click(Selector("#BindData_RequiredErrChangeList_0"));
    await t.click(Selector("#BindData_RequiredEnumList_0"));
    await t.click(Selector("#BindData_RequiredErrChangeEnumList_0"));
}

//================================================================================
// テスト
//================================================================================

//----------------------------------------------------------------------
// 初期状態および入力必須テスト
//----------------------------------------------------------------------
test("初期状態および入力必須テスト", async (t) => {

    await t.click(Selector("#mainsubmit"));

    await checkValid(t, "BindData_NormalCheckList",5);
    await checkInvalidMessageNoChange(t, "BindData_RequiredCheckList", 5);
    await checkInvalidMessageChange(t, "BindData_RequiredErrChangeList", 5);
    await checkValid(t, "BindData_NormalEnumList", 4);
    await checkInvalidMessageNoChange(t, "BindData_RequiredEnumList", 4);
    await checkInvalidMessageChange(t, "BindData_RequiredErrChangeEnumList", 4);

    await setDefatltNoErr(t);

    await t.click(Selector("#mainsubmit"));

    await t.expect(Selector("#NormalCheckList").textContent).eql("2:第2項目");
    await t.expect(Selector("#RequiredCheckList").textContent).eql("1:第1項目");
    await t.expect(Selector("#RequiredErrChangeList").textContent).eql("1:第1項目");
    await t.expect(Selector("#NormalEnumList").textContent).eql("sample3");
    await t.expect(Selector("#RequiredEnumList").textContent).eql("sample1");
    await t.expect(Selector("#RequiredErrChangeEnumList").textContent).eql("sample1");
});

//----------------------------------------------------------------------
// 通常チェックボックステスト
//----------------------------------------------------------------------
test("通常チェックボックステスト", async (t) => {

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalCheckList_0"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalCheckList").textContent).eql("2:第2項目,1:第1項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalCheckList_1"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalCheckList").textContent).eql("未選択");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalCheckList_2"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalCheckList").textContent).eql("2:第2項目,3:第3項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalCheckList_3"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalCheckList").textContent).eql("2:第2項目,4:第4項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalCheckList_4"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalCheckList").textContent).eql("2:第2項目,5:第5項目");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalCheckList_0"));
    await t.click(Selector("#BindData_NormalCheckList_2"));
    await t.click(Selector("#BindData_NormalCheckList_3"));
    await t.click(Selector("#BindData_NormalCheckList_4"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalCheckList").textContent).eql("2:第2項目,1:第1項目,3:第3項目,4:第4項目,5:第5項目");
});

//----------------------------------------------------------------------
// Enumチェックボックステスト
//----------------------------------------------------------------------
test("Enumチェックボックステスト", async (t) => {
    await setDefatltNoErr(t);

    await t.click(Selector("#BindData_NormalEnumList_0"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalEnumList").textContent).eql("sample3,sample1");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalEnumList_1"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalEnumList").textContent).eql("sample3,sample2");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalEnumList_2"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalEnumList").textContent).eql("未選択");
    await t.click(Selector("#returnLink"));

    await setDefatltNoErr(t);
    await t.click(Selector("#BindData_NormalEnumList_3"));
    await t.click(Selector("#mainsubmit"));
    await t.expect(Selector("#NormalEnumList").textContent).eql("sample3,sampleOther");
});

