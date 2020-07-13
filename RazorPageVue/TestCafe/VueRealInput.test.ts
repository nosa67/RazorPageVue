import "testcafe";
import { Selector } from "testcafe";
import { ClientFunction } from "testcafe";

fixture("Vue 実数入力コンポーネントテスト")
    .page("https://localhost:44357/RealInput");

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

//----------------------------------------------------------------------
//  入力値をテキストで取得する
//  【変数】
//      id: 対象のinputタグのid属性
//  【返値】
//      入力されている値（文字列）
//----------------------------------------------------------------------
const getStringValue = ClientFunction((id) => {
    return (document.getElementById(id) as HTMLInputElement).value;
});

//----------------------------------------------------------------------
//  入力値を整数で取得する
//  【変数】
//      id: 対象のinputタグのid属性
//  【返値】
//      入力されている値（整数）
//----------------------------------------------------------------------
const getRealValue = ClientFunction((id) => {
    return Number((document.getElementById(id) as HTMLInputElement).value);
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
async function checkValid(t, id) {
    await t.expect(getInputValidity(id)).eql(true);
    await t.expect(getValidationMessage(id)).eql("");
}

//----------------------------------------------------------------------
//  バリデーション異常チェック（通常メッセージ）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkInvalidMessageNoChange(t, id) {
    await t.expect(getInputValidity(id)).eql(false);
    const elementMessage = getValidationMessage(id);
    await t.expect(elementMessage).notEql("");
    await t.expect(elementMessage).notEql(null);
    await t.expect(elementMessage).notContains("変更");
}

//----------------------------------------------------------------------
//  バリデーション異常チェック（変更メッセージ）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkInvalidMessageChange(t, id) {
    await t.expect(getInputValidity(id)).eql(false);
    await t.expect(getValidationMessage(id)).contains("変更");
}

//----------------------------------------------------------------------
//  inputエレメントのクリア
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function clearInput(t, id)
{
    await t.selectText(Selector("#" + id)).pressKey('delete');
}

//----------------------------------------------------------------------
//  inputエレメントにキー入力
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//      text    ：入力するテキスト
//----------------------------------------------------------------------
async function addText(t, id, text) {
    await t.typeText(Selector("#" + id), text);
}

//----------------------------------------------------------------------
//  inputエレメントにキー入力(上書き)
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//      text    ：入力するテキスト
//----------------------------------------------------------------------
async function setText(t, id, text) {
    await t.typeText(Selector("#" + id), text, { replace: true });
}

//----------------------------------------------------------------------
//  加算ボタンをクリックする（ie,Edge用）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function ClickUpCounter(t, id) {
    await t.click("#up_" + id);
    return t;
}

//----------------------------------------------------------------------
//  減算ボタンをクリックする（ie,Edge用）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function ClickDownCounter(t, id) {
    await t.click("#down_" + id);
    return t;
}

//----------------------------------------------------------------------
//  一定時間加算ボタンをクリックする(実際にはドラッグで少し移動している)
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function longClickUpCounter(t, id) {
    await t.drag("#up_" + id, 5, 0, { speed: 0.01 });
    return t;
}

//----------------------------------------------------------------------
//  一定時間減算ボタンをクリックする(実際にはドラッグで少し移動している)
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function longClickDownCounter(t, id) {
    await t.drag("#down_" + id, 5, 0, { speed: 0.01 });
    return t;
}

//================================================================================
// テスト
//================================================================================

//----------------------------------------------------------------------
// 入力必須テスト
//----------------------------------------------------------------------
test("入力必須テスト", async (t) => {

    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 初期未入力チェック
    await checkValid(t, "BindData_Nochek");
    await checkInvalidMessageNoChange(t, "BindData_Required");
    await checkInvalidMessageChange(t, "BindData_RequiredErrch");

    // 正常チェック
    await addText(t, "BindData_Nochek", "0.1");
    await addText(t, "BindData_Required", "-0.2");
    await addText(t, "BindData_RequiredErrch", "1.2345");
    await t.click(Selector("#BindData_Required"));
    //await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Nochek");    
    await checkValid(t, "BindData_Required");    
    await checkValid(t, "BindData_RequiredErrch");    

    // 一旦入力してまたクリアしてのチェック
    await clearInput(t, "BindData_Nochek");
    await clearInput(t, "BindData_Required");
    await clearInput(t, "BindData_RequiredErrch");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Nochek");
    await checkInvalidMessageNoChange(t, "BindData_Required");
    await checkInvalidMessageChange(t, "BindData_RequiredErrch");
});

//----------------------------------------------------------------------
// 最小値エラーテスト
//----------------------------------------------------------------------
test("最小値エラーテスト", async (t) => {

    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 初期文字数不足エラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_MinM1_5");
    await checkInvalidMessageChange(t, "BindData_MinM1_5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM1_5");
    await clearInput(t, "BindData_MinM1_5Errch");
    await clearInput(t, "BindData_Min0");
    await clearInput(t, "BindData_Min1_2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5");    
    await checkValid(t, "BindData_MinM1_5Errch");    
    await checkValid(t, "BindData_Min0");    
    await checkValid(t, "BindData_Min1_2");    

    // -1.6にしてエラーを確認
    await addText(t, "BindData_MinM1_5", "-1.6");
    await addText(t, "BindData_MinM1_5Errch", "-1.6");
    await addText(t, "BindData_Min0", "-1.6");
    await addText(t, "BindData_Min1_2", "-1.6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_5");
    await checkInvalidMessageChange(t, "BindData_MinM1_5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2");

    // -1.5にしてエラーを確認
    await setText(t, "BindData_MinM1_5", "-1.5");
    await setText(t, "BindData_MinM1_5Errch", "-1.5");
    await setText(t, "BindData_Min0", "-1.5");
    await setText(t, "BindData_Min1_2", "-1.5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5");
    await checkValid(t, "BindData_MinM1_5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2");

    // -0.1にしてエラーを確認
    await setText(t, "BindData_MinM1_5", "-0.1");
    await setText(t, "BindData_MinM1_5Errch", "-0.1");
    await setText(t, "BindData_Min0", "-0.1");
    await setText(t, "BindData_Min1_2", "-0.1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5");
    await checkValid(t, "BindData_MinM1_5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM1_5", "0");
    await setText(t, "BindData_MinM1_5Errch", "0");
    await setText(t, "BindData_Min0", "0");
    await setText(t, "BindData_Min1_2", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5");
    await checkValid(t, "BindData_MinM1_5Errch");
    await checkValid(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2");

    // 0.1にしてエラーを確認
    await setText(t, "BindData_MinM1_5", "0.1");
    await setText(t, "BindData_MinM1_5Errch", "0.1");
    await setText(t, "BindData_Min0", "0.1");
    await setText(t, "BindData_Min1_2", "0.1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5");
    await checkValid(t, "BindData_MinM1_5Errch");
    await checkValid(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2");

    // 2にしてエラーを確認
    await setText(t, "BindData_MinM1_5", "2");
    await setText(t, "BindData_MinM1_5Errch", "2");
    await setText(t, "BindData_Min0", "2");
    await setText(t, "BindData_Min1_2", "2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5");
    await checkValid(t, "BindData_MinM1_5Errch"); 
    await checkValid(t, "BindData_Min0");
    await checkValid(t, "BindData_Min1_2");
});

//----------------------------------------------------------------------
// 最大値エラーテスト
//----------------------------------------------------------------------
test("最大値エラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数オーバーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_Max1_5");
    await checkInvalidMessageChange(t, "BindData_Max1_5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_Max1_5");
    await clearInput(t, "BindData_Max1_5Errch");
    await clearInput(t, "BindData_Max0");
    await clearInput(t, "BindData_MaxM1_2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max1_5");    
    await checkValid(t, "BindData_Max1_5Errch");    
    await checkValid(t, "BindData_Max0");    
    await checkValid(t, "BindData_MaxM1_2");    

    // 1.6にしてエラーを確認
    await addText(t, "BindData_Max1_5", "1.6");
    await addText(t, "BindData_Max1_5Errch", "1.6");
    await addText(t, "BindData_Max0", "1.6");
    await addText(t, "BindData_MaxM1_2", "1.6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max1_5");
    await checkInvalidMessageChange(t, "BindData_Max1_5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2");

    // 1.5にしてエラーを確認
    await setText(t, "BindData_Max1_5", "1.5");
    await setText(t, "BindData_Max1_5Errch", "1.5");
    await setText(t, "BindData_Max0", "1.5");
    await setText(t, "BindData_MaxM1_2", "1.5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max1_5");
    await checkValid(t, "BindData_Max1_5Errch");    
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2");

    // 0.1にしてエラーを確認
    await setText(t, "BindData_Max1_5", "0.1");
    await setText(t, "BindData_Max1_5Errch", "0.1");
    await setText(t, "BindData_Max0", "0.1");
    await setText(t, "BindData_MaxM1_2", "0.1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max1_5");
    await checkValid(t, "BindData_Max1_5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2");

    // 0にしてエラーを確認
    await setText(t, "BindData_Max1_5", "0");
    await setText(t, "BindData_Max1_5Errch", "0");
    await setText(t, "BindData_Max0", "0");
    await setText(t, "BindData_MaxM1_2", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max1_5");
    await checkValid(t, "BindData_Max1_5Errch");
    await checkValid(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2");

    // -0.1にしてエラーを確認
    await setText(t, "BindData_Max1_5", "-0.1");
    await setText(t, "BindData_Max1_5Errch", "-0.1");
    await setText(t, "BindData_Max0", "-0.1");
    await setText(t, "BindData_MaxM1_2", "-0.1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max1_5");
    await checkValid(t, "BindData_Max1_5Errch");
    await checkValid(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2");

    // -1.2にしてエラーを確認
    await setText(t, "BindData_Max1_5", "-1.2");
    await setText(t, "BindData_Max1_5Errch", "-1.2");
    await setText(t, "BindData_Max0", "-1.2");
    await setText(t, "BindData_MaxM1_2", "-1.2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max1_5");
    await checkValid(t, "BindData_Max1_5Errch");
    await checkValid(t, "BindData_Max0");
    await checkValid(t, "BindData_MaxM1_2");
});

//----------------------------------------------------------------------
// ステップエラーテスト
//----------------------------------------------------------------------
test("ステップエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // ステップエラーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_Step0_2");
    await checkInvalidMessageChange(t, "BindData_Step0_2Errch");
    await checkInvalidMessageNoChange(t, "BindData_Step0_3");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_Step0_2");
    await clearInput(t, "BindData_Step0_2Errch");
    await clearInput(t, "BindData_Step0_3");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Step0_2");    
    await checkValid(t, "BindData_Step0_2Errch");    
    await checkValid(t, "BindData_Step0_3");    

    // 0にしてエラーを確認
    await setText(t, "BindData_Step0_2", "0");
    await setText(t, "BindData_Step0_2Errch", "0");
    await setText(t, "BindData_Step0_3", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Step0_2");
    await checkValid(t, "BindData_Step0_2Errch");
    await checkValid(t, "BindData_Step0_3");

    // 0.1にしてエラーを確認
    await setText(t, "BindData_Step0_2", "0.1");
    await setText(t, "BindData_Step0_2Errch", "0.1");
    await setText(t, "BindData_Step0_3", "0.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Step0_2");
    await checkInvalidMessageChange(t, "BindData_Step0_2Errch");
    await checkInvalidMessageNoChange(t, "BindData_Step0_3");

    // 0.2にしてエラーを確認
    await setText(t, "BindData_Step0_2", "0.2");
    await setText(t, "BindData_Step0_2Errch", "0.2");
    await setText(t, "BindData_Step0_3", "0.2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Step0_2");
    await checkValid(t, "BindData_Step0_2Errch");
    await checkInvalidMessageNoChange(t, "BindData_Step0_3");

    // 0.3にしてエラーを確認
    await setText(t, "BindData_Step0_2", "0.3");
    await setText(t, "BindData_Step0_2Errch", "0.3");
    await setText(t, "BindData_Step0_3", "0.3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Step0_2");
    await checkInvalidMessageChange(t, "BindData_Step0_2Errch");
    await checkValid(t, "BindData_Step0_3");

});

//----------------------------------------------------------------------
// 最小値+最大値エラーテスト
//----------------------------------------------------------------------
test("最小値+最大値エラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 最小値+最大値エラーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM1_0MaxM0_5");
    await clearInput(t, "BindData_MinM0_5Max0");
    await clearInput(t, "BindData_MinM0_5Max0_5");
    await clearInput(t, "BindData_Min0Max0_5");
    await clearInput(t, "BindData_Min0_5Max1_0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_0MaxM0_5");
    await checkValid(t, "BindData_MinM0_5Max0");
    await checkValid(t, "BindData_MinM0_5Max0_5");
    await checkValid(t, "BindData_Min0Max0_5");    
    await checkValid(t, "BindData_Min0_5Max1_0");    

    // -1.1にしてエラーを確認
    await addText(t, "BindData_MinM1_0MaxM0_5", "-1.1");
    await addText(t, "BindData_MinM0_5Max0", "-1.1");
    await addText(t, "BindData_MinM0_5Max0_5", "-1.1");
    await addText(t, "BindData_Min0Max0_5", "-1.1");
    await addText(t, "BindData_Min0_5Max1_0", "-1.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // -1.0にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "-1.0");
    await setText(t, "BindData_MinM0_5Max0", "-1.0");
    await setText(t, "BindData_MinM0_5Max0_5", "-1.0");
    await setText(t, "BindData_Min0Max0_5", "-1.0");
    await setText(t, "BindData_Min0_5Max1_0", "-1.0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // -0.6にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "-0.6");
    await setText(t, "BindData_MinM0_5Max0", "-0.6");
    await setText(t, "BindData_MinM0_5Max0_5", "-0.6");
    await setText(t, "BindData_Min0Max0_5", "-0.6");
    await setText(t, "BindData_Min0_5Max1_0", "-0.6");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // -0.5にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "-0.5");
    await setText(t, "BindData_MinM0_5Max0", "-0.5");
    await setText(t, "BindData_MinM0_5Max0_5", "-0.5");
    await setText(t, "BindData_Min0Max0_5", "-0.5");
    await setText(t, "BindData_Min0_5Max1_0", "-0.5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_0MaxM0_5");
    await checkValid(t, "BindData_MinM0_5Max0");
    await checkValid(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // -0.1にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "-0.1");
    await setText(t, "BindData_MinM0_5Max0", "-0.1");
    await setText(t, "BindData_MinM0_5Max0_5", "-0.1");
    await setText(t, "BindData_Min0Max0_5", "-0.1");
    await setText(t, "BindData_Min0_5Max1_0", "-0.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkValid(t, "BindData_MinM0_5Max0");
    await checkValid(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "0");
    await setText(t, "BindData_MinM0_5Max0", "0");
    await setText(t, "BindData_MinM0_5Max0_5", "0");
    await setText(t, "BindData_Min0Max0_5", "0");
    await setText(t, "BindData_Min0_5Max1_0", "0");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkValid(t, "BindData_MinM0_5Max0");
    await checkValid(t, "BindData_MinM0_5Max0_5");
    await checkValid(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // 0.1にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "0.1");
    await setText(t, "BindData_MinM0_5Max0", "0.1");
    await setText(t, "BindData_MinM0_5Max0_5", "0.1");
    await setText(t, "BindData_Min0Max0_5", "0.1");
    await setText(t, "BindData_Min0_5Max1_0", "0.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkValid(t, "BindData_MinM0_5Max0_5");
    await checkValid(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

    // 0.5にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "0.5");
    await setText(t, "BindData_MinM0_5Max0", "0.5");
    await setText(t, "BindData_MinM0_5Max0_5", "0.5");
    await setText(t, "BindData_Min0Max0_5", "0.5");
    await setText(t, "BindData_Min0_5Max1_0", "0.5");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkValid(t, "BindData_MinM0_5Max0_5");
    await checkValid(t, "BindData_Min0Max0_5");
    await checkValid(t, "BindData_Min0_5Max1_0");

    // 0.6にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "0.6");
    await setText(t, "BindData_MinM0_5Max0", "0.6");
    await setText(t, "BindData_MinM0_5Max0_5", "0.6");
    await setText(t, "BindData_Min0Max0_5", "0.6");
    await setText(t, "BindData_Min0_5Max1_0", "0.6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkValid(t, "BindData_Min0_5Max1_0");

    // 1.0にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "1.0");
    await setText(t, "BindData_MinM0_5Max0", "1.0");
    await setText(t, "BindData_MinM0_5Max0_5", "1.0");
    await setText(t, "BindData_Min0Max0_5", "1.0");
    await setText(t, "BindData_Min0_5Max1_0", "1.0");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkValid(t, "BindData_Min0_5Max1_0");

    // 1.1にしてエラーを確認
    await setText(t, "BindData_MinM1_0MaxM0_5", "1.1");
    await setText(t, "BindData_MinM0_5Max0", "1.1");
    await setText(t, "BindData_MinM0_5Max0_5", "1.1");
    await setText(t, "BindData_Min0Max0_5", "1.1");
    await setText(t, "BindData_Min0_5Max1_0", "1.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_0MaxM0_5");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max0_5");
    await checkInvalidMessageNoChange(t, "BindData_Min0_5Max1_0");

});

//----------------------------------------------------------------------
// 最小値+ステップエラーテスト
//----------------------------------------------------------------------
test("最小値+ステップエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // ステップエラーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_MinM1_5Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2Step0_3");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM1_5Step0_3");
    await clearInput(t, "BindData_Min0Step0_3");
    await clearInput(t, "BindData_Min1_2Step0_3");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5Step0_3");
    await checkValid(t, "BindData_Min0Step0_3");
    await checkValid(t, "BindData_Min1_2Step0_3");

    // -1.6にしてエラーを確認
    await addText(t, "BindData_MinM1_5Step0_3", "-1.6");
    await addText(t, "BindData_Min0Step0_3", "1.-6");
    await addText(t, "BindData_Min1_2Step0_3", "-1.6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_5Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2Step0_3");

    // -1.5にしてエラーを確認
    await setText(t, "BindData_MinM1_5Step0_3", "-1.5");
    await setText(t, "BindData_Min0Step0_3", "-1.5");
    await setText(t, "BindData_Min1_2Step0_3", "-1.5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2Step0_3");

    // -1.2にしてエラーを確認
    await setText(t, "BindData_MinM1_5Step0_3", "-1.2");
    await setText(t, "BindData_Min0Step0_3", "-1.2");
    await setText(t, "BindData_Min1_2Step0_3", "-1.2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2Step0_3");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM1_5Step0_3", "0");
    await setText(t, "BindData_Min0Step0_3", "0");
    await setText(t, "BindData_Min1_2Step0_3", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5Step0_3");
    await checkValid(t, "BindData_Min0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2Step0_3");

    // 0.1にしてエラーを確認
    await setText(t, "BindData_MinM1_5Step0_3", "0.1");
    await setText(t, "BindData_Min0Step0_3", "0.1");
    await setText(t, "BindData_Min1_2Step0_3", "0.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_5Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2Step0_3");

    // 1.2にしてエラーを確認
    await setText(t, "BindData_MinM1_5Step0_3", "1.2");
    await setText(t, "BindData_Min0Step0_3", "1.2");
    await setText(t, "BindData_Min1_2Step0_3", "1.2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5Step0_3");
    await checkValid(t, "BindData_Min0Step0_3");
    await checkValid(t, "BindData_Min1_2Step0_3");

    // 1.3にしてエラーを確認
    await setText(t, "BindData_MinM1_5Step0_3", "1.3");
    await setText(t, "BindData_Min0Step0_3", "1.3");
    await setText(t, "BindData_Min1_2Step0_3", "1.3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM1_5Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_Min1_2Step0_3");

    // 1.5にしてエラーを確認
    await setText(t, "BindData_MinM1_5Step0_3", "1.5");
    await setText(t, "BindData_Min0Step0_3", "1.5");
    await setText(t, "BindData_Min1_2Step0_3", "1.5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM1_5Step0_3");
    await checkValid(t, "BindData_Min0Step0_3");
    await checkValid(t, "BindData_Min1_2Step0_3");
});

//----------------------------------------------------------------------
// 最大値＋ステップエラーテスト
//----------------------------------------------------------------------
test("最大値＋ステップエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数オーバーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_Max0_5Step0_2");
    await clearInput(t, "BindData_Max0Step0_3");
    await clearInput(t, "BindData_MaxM1_2Step0_4");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max0_5Step0_2");
    await checkValid(t, "BindData_Max0Step0_3");
    await checkValid(t, "BindData_MaxM1_2Step0_4");

    // 0.6にしてエラーを確認
    await addText(t, "BindData_Max0_5Step0_2", "0.6");
    await addText(t, "BindData_Max0Step0_3", "0.6");
    await addText(t, "BindData_MaxM1_2Step0_4", "0.6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // 0.5にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "0.5");
    await setText(t, "BindData_Max0Step0_3", "0.5");
    await setText(t, "BindData_MaxM1_2Step0_4", "0.5");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // 0.4にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "0.4");
    await setText(t, "BindData_Max0Step0_3", "0.4");
    await setText(t, "BindData_MaxM1_2Step0_4", "0.4");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // 0.3にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "0.3");
    await setText(t, "BindData_Max0Step0_3", "0.3");
    await setText(t, "BindData_MaxM1_2Step0_4", "0.3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // 0.2にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "0.2");
    await setText(t, "BindData_Max0Step0_3", "0.2");
    await setText(t, "BindData_MaxM1_2Step0_4", "0.2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // 0.1にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "0.1");
    await setText(t, "BindData_Max0Step0_3", "0.1");
    await setText(t, "BindData_MaxM1_2Step0_4", "0.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // 0にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "0");
    await setText(t, "BindData_Max0Step0_3", "0");
    await setText(t, "BindData_MaxM1_2Step0_4", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max0_5Step0_2");
    await checkValid(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");


    // -0.1にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "-0.1");
    await setText(t, "BindData_Max0Step0_3", "-0.1");
    await setText(t, "BindData_MaxM1_2Step0_4", "-0.1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // -0.2にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "-0.2");
    await setText(t, "BindData_Max0Step0_3", "-0.2");
    await setText(t, "BindData_MaxM1_2Step0_4", "-0.2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // -0.3にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "-0.3");
    await setText(t, "BindData_Max0Step0_3", "-0.3");
    await setText(t, "BindData_MaxM1_2Step0_4", "-0.3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max0_5Step0_2");
    await checkValid(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // -1.4にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "-1.4");
    await setText(t, "BindData_Max0Step0_3", "-1.4");
    await setText(t, "BindData_MaxM1_2Step0_4", "-1.4");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM1_2Step0_4");

    // -1.6にしてエラーを確認
    await setText(t, "BindData_Max0_5Step0_2", "-1.6");
    await setText(t, "BindData_Max0Step0_3", "-1.6");
    await setText(t, "BindData_MaxM1_2Step0_4", "-1.6");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max0_5Step0_2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step0_3");
    await checkValid(t, "BindData_MaxM1_2Step0_4");

});

//----------------------------------------------------------------------
// 最小値+最大値＋ステップエラーテスト
//----------------------------------------------------------------------
test("最小値+最大値＋ステップエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数オーバーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Step0_3Max0_5");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM0_5Step0_3Max0_5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM0_5Step0_3Max0_5");

    // -0.6にしてエラーを確認
    await addText(t, "BindData_MinM0_5Step0_3Max0_5", "-0.6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Step0_3Max0_5");

    // -0.5にしてエラーを確認
    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "-0.5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM0_5Step0_3Max0_5");

    // -0.4にしてエラーを確認
    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "-0.4");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Step0_3Max0_5");

    // -0.3にしてエラーを確認
    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "-0.3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Step0_3Max0_5");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "0");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Step0_3Max0_5");

    // 0.1にしてエラーを確認
    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "0.1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM0_5Step0_3Max0_5");

    // 0.5にしてエラーを確認
    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "0.5");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Step0_3Max0_5");

    // 0.6にしてエラーを確認
    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "0.6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM0_5Step0_3Max0_5");

});

//----------------------------------------------------------------------
// カウンターボタンテスト(IEのみ)
//----------------------------------------------------------------------
test("カウンターボタンテスト(IEのみ)", async (t) => {
    // IEおよびge場合のみカウントボタンのテストを行う
    // 残念ながら、ChromeやFireFoxで組み込まれているボタンは押せない
    if (t.browser.name === 'Internet Explorer') {

        // 最小値のない入力で加算ボタンをクリックして初期値が0であることをチェック
        await clearInput(t, "BindData_Step0_2");
        await ClickUpCounter(t, 'BindData_Step0_2');
        await t.expect(getStringValue('BindData_Step0_2')).eql("0");
        await checkValid(t, "BindData_Step0_2");

        // もう一度加算ボタンをクリックして0.2であることをチェック
        await ClickUpCounter(t, 'BindData_Step0_2');
        await t.expect(getStringValue('BindData_Step0_2')).eql("0.2");
        await checkValid(t, "BindData_Step0_2");

        // さらにしばらく押して0.4より大きくなっていることを確認（連続アップの確認）
        await longClickUpCounter(t, 'BindData_Step0_2');
        await t.expect(getRealValue('BindData_Step0_2')).gt(0.4);
        await checkValid(t, "BindData_Step0_2");

        // 最小値のない入力で減算ボタンをクリックして初期値が0であることをチェック
        await clearInput(t, "BindData_Step0_2");
        await ClickDownCounter(t, 'BindData_Step0_2');
        await t.expect(getStringValue('BindData_Step0_2')).eql("0");
        await checkValid(t, "BindData_Step0_2");

        // もう一度加算ボタンをクリックして-0.2であることをチェック
        await ClickDownCounter(t, 'BindData_Step0_2');
        await t.expect(getStringValue('BindData_Step0_2')).eql("-0.2");
        await checkValid(t, "BindData_Step0_2");

        // さらにしばらく押して-0.4より小さくなっていることを確認（連続アップの確認）
        await longClickDownCounter(t, 'BindData_Step0_2');
        await t.expect(getRealValue('BindData_Step0_2')).lt(-0.4);
        await checkValid(t, "BindData_Step0_2");

        // 最大値が0未満の加算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_MaxM1_2Step0_4");

        // 最小値のない入力で加算ボタンをクリックして初期値が-1.2であることをチェック
        await ClickUpCounter(t, 'BindData_MaxM1_2Step0_4');
        await t.expect(getStringValue('BindData_MaxM1_2Step0_4')).eql("-1.2");
        await checkValid(t, "BindData_MaxM1_2Step0_4");

        // もう一度加算ボタンをクリックして-1.2のままであることをチェック
        await ClickUpCounter(t, 'BindData_MaxM1_2Step0_4');
        await t.expect(getStringValue('BindData_MaxM1_2Step0_4')).eql("-1.2");
        await checkValid(t, "BindData_MaxM1_2Step0_4");

        // さらにしばらく押して-1.2のままであることをチェック
        await longClickUpCounter(t, 'BindData_MaxM1_2Step0_4');
        await t.expect(getStringValue('BindData_MaxM1_2Step0_4')).eql("-1.2");
        await checkValid(t, "BindData_MaxM1_2Step0_4");

        // 最大値が0未満の減算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_MaxM1_2Step0_4");

        // 最小値のない入力で加算ボタンをクリックして初期値が-1.2であることをチェック
        await ClickDownCounter(t, 'BindData_MaxM1_2Step0_4');
        await t.expect(getStringValue('BindData_MaxM1_2Step0_4')).eql("-1.2");
        await checkValid(t, "BindData_MaxM1_2Step0_4");

        // もう一度加算ボタンをクリックして-1.6であることをチェック
        await ClickDownCounter(t, 'BindData_MaxM1_2Step0_4');
        await t.expect(getStringValue('BindData_MaxM1_2Step0_4')).eql("-1.6");
        await checkValid(t, "BindData_MaxM1_2Step0_4");

        // さらにしばらく押して-2.0未満のままであることをチェック
        await longClickDownCounter(t, 'BindData_MaxM1_2Step0_4');
        await t.expect(getRealValue('BindData_MaxM1_2Step0_4')).lt(-2.0);
        await checkValid(t, "BindData_MaxM1_2Step0_4");

        // 最小値が1以上の加算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_Min1_2Step0_3");

        // 最小値の1以上で加算ボタンをクリックして初期値が1.2であることをチェック
        await ClickUpCounter(t, 'BindData_Min1_2Step0_3');
        await t.expect(getStringValue('BindData_Min1_2Step0_3')).eql("1.2");
        await checkValid(t, "BindData_Min1_2Step0_3");

        // もう一度加算ボタンをクリックして1.5であることをチェック
        await ClickUpCounter(t, 'BindData_Min1_2Step0_3');
        await t.expect(getStringValue('BindData_Min1_2Step0_3')).eql("1.5");
        await checkValid(t, "BindData_Min1_2Step0_3");

        // さらにしばらく押して1.8以上であることをチェック
        await longClickUpCounter(t, 'BindData_Min1_2Step0_3');
        await t.expect(getRealValue('BindData_Min1_2Step0_3')).gt(1.8);
        await checkValid(t, "BindData_Min1_2Step0_3");

        // 最小値が1以上の減算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_Min1_2Step0_3");

        // 最小値が1以上で減算ボタンをクリックして初期値が1.2であることをチェック
        await ClickDownCounter(t, 'BindData_Min1_2Step0_3');
        await t.expect(getStringValue('BindData_Min1_2Step0_3')).eql("1.2");
        await checkValid(t, "BindData_Min1_2Step0_3");

        // もう一度減算ボタンをクリックして5であることをチェック
        await ClickDownCounter(t, 'BindData_Min1_2Step0_3');
        await t.expect(getStringValue('BindData_Min1_2Step0_3')).eql("1.2");
        await checkValid(t, "BindData_Min1_2Step0_3");

        // さらにしばらく押して5のままであることをチェック
        await longClickDownCounter(t, 'BindData_Min1_2Step0_3');
        await t.expect(getStringValue('BindData_Min1_2Step0_3')).eql("1.2");
        await checkValid(t, "BindData_Min1_2Step0_3");
    }
});

//----------------------------------------------------------------------
// 正常動作テスト
//----------------------------------------------------------------------
test("正常動作テスト", async (t) => {

    await setText(t, "BindData_Nochek", "1.222");
    await setText(t, "BindData_Required", "1.234");
    await setText(t, "BindData_RequiredErrch", "-1.245");

    await setText(t, "BindData_MinM1_5", "-1.2");
    await setText(t, "BindData_MinM1_5Errch", "1.1");
    await setText(t, "BindData_Min0", "2.5");
    await setText(t, "BindData_Min1_2", "3.21");

    await setText(t, "BindData_Max1_5", "-1.2");
    await setText(t, "BindData_Max1_5Errch", "-200.221");
    await setText(t, "BindData_Max0", "-1.111");
    await setText(t, "BindData_MaxM1_2", "-30.2");

    await setText(t, "BindData_Step0_2", "0.2");
    await setText(t, "BindData_Step0_2Errch", "0.6");
    await setText(t, "BindData_Step0_3", "0.9");

    await setText(t, "BindData_MinM1_0MaxM0_5", "-0.7");
    await setText(t, "BindData_MinM0_5Max0", "-0.1");
    await setText(t, "BindData_MinM0_5Max0_5", "0.1");
    await setText(t, "BindData_Min0Max0_5", "0.3");
    await setText(t, "BindData_Min0_5Max1_0", "0.8");

    await setText(t, "BindData_MinM1_5Step0_3", "-1.2");
    await setText(t, "BindData_Min0Step0_3", "0.6");
    await setText(t, "BindData_Min1_2Step0_3", "1.8");

    await setText(t, "BindData_Max0_5Step0_2", "-0.4");
    await setText(t, "BindData_Max0Step0_3", "-0.9");
    await setText(t, "BindData_MaxM1_2Step0_4", "-3.2");

    await setText(t, "BindData_MinM0_5Step0_3Max0_5", "0.4");


    await t.click(Selector("#mainsubmit"));

    // 表示チェック
    await t.expect(Selector("#Nochek").textContent).eql("1.222");
    await t.expect(Selector("#Required").textContent).eql("1.234");
    await t.expect(Selector("#RequiredErrch").textContent).eql("-1.245");

    await t.expect(Selector("#MinM1_5").textContent).eql("-1.2");
    await t.expect(Selector("#MinM1_5Errch").textContent).eql("1.1");
    await t.expect(Selector("#Min0").textContent).eql("2.5");
    await t.expect(Selector("#Min1_2").textContent).eql("3.21");

    await t.expect(Selector("#Max1_5").textContent).eql("-1.2");
    await t.expect(Selector("#Max1_5Errch").textContent).eql("-200.221");
    await t.expect(Selector("#Max0").textContent).eql("-1.111");
    await t.expect(Selector("#MaxM1_2").textContent).eql("-30.2");

    await t.expect(Selector("#Step0_2").textContent).eql("0.2");
    await t.expect(Selector("#Step0_2Errch").textContent).eql("0.6");
    await t.expect(Selector("#Step0_3").textContent).eql("0.9");

    await t.expect(Selector("#MinM1_0MaxM0_5").textContent).eql("-0.7");
    await t.expect(Selector("#MinM0_5Max0").textContent).eql("-0.1");
    await t.expect(Selector("#MinM0_5Max0_5").textContent).eql("0.1");
    await t.expect(Selector("#Min0Max0_5").textContent).eql("0.3");
    await t.expect(Selector("#Min0_5Max1_0").textContent).eql("0.8");

    await t.expect(Selector("#MinM1_5Step0_3").textContent).eql("-1.2");
    await t.expect(Selector("#Min0Step0_3").textContent).eql("0.6");
    await t.expect(Selector("#Min1_2Step0_3").textContent).eql("1.8");

    await t.expect(Selector("#Max0_5Step0_2").textContent).eql("-0.4");
    await t.expect(Selector("#Max0Step0_3").textContent).eql("-0.9");
    await t.expect(Selector("#MaxM1_2Step0_4").textContent).eql("-3.2");

    await t.expect(Selector("#MinM0_5Step0_3Max0_5").textContent).eql("0.4");
});