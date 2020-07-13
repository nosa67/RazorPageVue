import "testcafe";
import { Selector } from "testcafe";
import { ClientFunction } from "testcafe";

//********************************************************************************
// 整数入力コンポーネントのテスト
// ただし、このテストでは実施できないテストがある
//  整数テスト。初期値や貼付により整数でないものや[1e3」といった指数表記が入力できるが
//  本コンポーネントはそれを禁止している。しかしながらTestCafeではtype=numberのinputエレメントに対して、
//  setTextを実施しても数値と[+-.]以外の入力が実施されないのでテストできない
//********************************************************************************

fixture("Vue 整数入力コンポーネントテスト")
    .page("https://localhost:44357/IntegerInput");

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
    const element = document.getElementById(id) as HTMLInputElement;
    return element.value;
});

//----------------------------------------------------------------------
//  入力値を整数で取得する
//  【変数】
//      id: 対象のinputタグのid属性
//  【返値】
//      入力されている値（整数）
//----------------------------------------------------------------------
const getIntegerValue = ClientFunction((id) => {
    const element = document.getElementById(id) as HTMLInputElement;
    return parseInt(element.value);
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
    await t.selectText(Selector("#" + id)).pressKey('delete');
    await t.typeText(Selector("#" + id), text, { replace: true } );
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
    await t.click("#down_" +id);
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

    // 数値以外チェック
    await addText(t, "BindData_Nochek", "ert");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Nochek");    
    await t.wait(10000);

    // 正常チェック
    await addText(t, "BindData_Nochek", "0");
    await addText(t, "BindData_Required", "-100");
    await addText(t, "BindData_RequiredErrch", "10000");
    await t.click(Selector("#mainsubmit"));
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
    await checkInvalidMessageNoChange(t, "BindData_MinM5");
    await checkInvalidMessageChange(t, "BindData_MinM5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min2");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM5");
    await clearInput(t, "BindData_MinM5Errch");
    await clearInput(t, "BindData_Min0");
    await clearInput(t, "BindData_Min2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5");    
    await checkValid(t, "BindData_MinM5Errch");    
    await checkValid(t, "BindData_Min0");    
    await checkValid(t, "BindData_Min2");    

    // -6にしてエラーを確認
    await addText(t, "BindData_MinM5", "-6");
    await addText(t, "BindData_MinM5Errch", "-6");
    await addText(t, "BindData_Min0", "-6");
    await addText(t, "BindData_Min2", "-6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5");
    await checkInvalidMessageChange(t, "BindData_MinM5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min2");

    // -5にしてエラーを確認
    await setText(t, "BindData_MinM5", "-5");
    await setText(t, "BindData_MinM5Errch", "-5");
    await setText(t, "BindData_Min0", "-5");
    await setText(t, "BindData_Min2", "-5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5");
    await checkValid(t, "BindData_MinM5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min2");

    // -1にしてエラーを確認
    await setText(t, "BindData_MinM5", "-1");
    await setText(t, "BindData_MinM5Errch", "-1");
    await setText(t, "BindData_Min0", "-1");
    await setText(t, "BindData_Min2", "-1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5");
    await checkValid(t, "BindData_MinM5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min2");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM5", "0");
    await setText(t, "BindData_MinM5Errch", "0");
    await setText(t, "BindData_Min0", "0");
    await setText(t, "BindData_Min2", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5");
    await checkValid(t, "BindData_MinM5Errch");
    await checkValid(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min2");

    // 1にしてエラーを確認
    await setText(t, "BindData_MinM5", "1");
    await setText(t, "BindData_MinM5Errch", "1");
    await setText(t, "BindData_Min0", "1");
    await setText(t, "BindData_Min2", "1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5");
    await checkValid(t, "BindData_MinM5Errch");
    await checkValid(t, "BindData_Min0");
    await checkInvalidMessageNoChange(t, "BindData_Min2");

    // 2にしてエラーを確認
    await setText(t, "BindData_MinM5", "2");
    await setText(t, "BindData_MinM5Errch", "2");
    await setText(t, "BindData_Min0", "2");
    await setText(t, "BindData_Min2", "2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5");
    await checkValid(t, "BindData_MinM5Errch"); 
    await checkValid(t, "BindData_Min0");
    await checkValid(t, "BindData_Min2");
});

//----------------------------------------------------------------------
// 最大値エラーテスト
//----------------------------------------------------------------------
test("最大値エラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数オーバーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_Max5");
    await checkInvalidMessageChange(t, "BindData_Max5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_Max5");
    await clearInput(t, "BindData_Max5Errch");
    await clearInput(t, "BindData_Max0");
    await clearInput(t, "BindData_MaxM2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5");    
    await checkValid(t, "BindData_Max5Errch");    
    await checkValid(t, "BindData_Max0");    
    await checkValid(t, "BindData_MaxM2");    

    // 6にしてエラーを確認
    await addText(t, "BindData_Max5", "6");
    await addText(t, "BindData_Max5Errch", "6");
    await addText(t, "BindData_Max0", "6");
    await addText(t, "BindData_MaxM2", "6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max5");
    await checkInvalidMessageChange(t, "BindData_Max5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2");

    // 5にしてエラーを確認
    await setText(t, "BindData_Max5", "5");
    await setText(t, "BindData_Max5Errch", "5");
    await setText(t, "BindData_Max0", "5");
    await setText(t, "BindData_MaxM2", "5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5");
    await checkValid(t, "BindData_Max5Errch");    
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2");

    // 1にしてエラーを確認
    await setText(t, "BindData_Max5", "1");
    await setText(t, "BindData_Max5Errch", "1");
    await setText(t, "BindData_Max0", "1");
    await setText(t, "BindData_MaxM2", "1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5");
    await checkValid(t, "BindData_Max5Errch");
    await checkInvalidMessageNoChange(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2");

    // 0にしてエラーを確認
    await setText(t, "BindData_Max5", "0");
    await setText(t, "BindData_Max5Errch", "0");
    await setText(t, "BindData_Max0", "0");
    await setText(t, "BindData_MaxM2", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5");
    await checkValid(t, "BindData_Max5Errch");
    await checkValid(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2");

    // -1にしてエラーを確認
    await setText(t, "BindData_Max5", "-1");
    await setText(t, "BindData_Max5Errch", "-1");
    await setText(t, "BindData_Max0", "-1");
    await setText(t, "BindData_MaxM2", "-1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5");
    await checkValid(t, "BindData_Max5Errch");
    await checkValid(t, "BindData_Max0");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2");

    // -2にしてエラーを確認
    await setText(t, "BindData_Max5", "-2");
    await setText(t, "BindData_Max5Errch", "-2");
    await setText(t, "BindData_Max0", "-2");
    await setText(t, "BindData_MaxM2", "-2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5");
    await checkValid(t, "BindData_Max5Errch");
    await checkValid(t, "BindData_Max0");
    await checkValid(t, "BindData_MaxM2");
});

//----------------------------------------------------------------------
// ステップエラーテスト
//----------------------------------------------------------------------
test("ステップエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // ステップエラーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_Step2");
    await checkInvalidMessageChange(t, "BindData_Step2Errch");
    await checkInvalidMessageNoChange(t, "BindData_Step3");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_Step2");
    await clearInput(t, "BindData_Step2Errch");
    await clearInput(t, "BindData_Step3");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Step2");    
    await checkValid(t, "BindData_Step2Errch");    
    await checkValid(t, "BindData_Step3");    

    // 0にしてエラーを確認
    await setText(t, "BindData_Step2", "0");
    await setText(t, "BindData_Step2Errch", "0");
    await setText(t, "BindData_Step3", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Step2");
    await checkValid(t, "BindData_Step2Errch");
    await checkValid(t, "BindData_Step3");

    // 1にしてエラーを確認
    await setText(t, "BindData_Step2", "1");
    await setText(t, "BindData_Step2Errch", "1");
    await setText(t, "BindData_Step3", "1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Step2");
    await checkInvalidMessageChange(t, "BindData_Step2Errch");
    await checkInvalidMessageNoChange(t, "BindData_Step3");

    // 2にしてエラーを確認
    await setText(t, "BindData_Step2", "2");
    await setText(t, "BindData_Step2Errch", "2");
    await setText(t, "BindData_Step3", "2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Step2");
    await checkValid(t, "BindData_Step2Errch");
    await checkInvalidMessageNoChange(t, "BindData_Step3");

    // 3にしてエラーを確認
    await setText(t, "BindData_Step2", "3");
    await setText(t, "BindData_Step2Errch", "3");
    await setText(t, "BindData_Step3", "3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Step2");
    await checkInvalidMessageChange(t, "BindData_Step2Errch");
    await checkValid(t, "BindData_Step3");

});

//----------------------------------------------------------------------
// 最小値+最大値エラーテスト
//----------------------------------------------------------------------
test("最小値+最大値エラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 最小値+最大値エラーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM10MaxM5");
    await clearInput(t, "BindData_MinM5Max0");
    await clearInput(t, "BindData_MinM5Max5");
    await clearInput(t, "BindData_Min0Max5");
    await clearInput(t, "BindData_Min5Max10");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM10MaxM5");
    await checkValid(t, "BindData_MinM5Max0");
    await checkValid(t, "BindData_MinM5Max5");
    await checkValid(t, "BindData_Min0Max5");    
    await checkValid(t, "BindData_Min5Max10");    

    // -11にしてエラーを確認
    await addText(t, "BindData_MinM10MaxM5", "-11");
    await addText(t, "BindData_MinM5Max0", "-11");
    await addText(t, "BindData_MinM5Max5", "-11");
    await addText(t, "BindData_Min0Max5", "-11");
    await addText(t, "BindData_Min5Max10", "-11");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // -10にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "-10");
    await setText(t, "BindData_MinM5Max0", "-10");
    await setText(t, "BindData_MinM5Max5", "-10");
    await setText(t, "BindData_Min0Max5", "-10");
    await setText(t, "BindData_Min5Max10", "-10");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // -6にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "-6");
    await setText(t, "BindData_MinM5Max0", "-6");
    await setText(t, "BindData_MinM5Max5", "-6");
    await setText(t, "BindData_Min0Max5", "-6");
    await setText(t, "BindData_Min5Max10", "-6");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // -5にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "-5");
    await setText(t, "BindData_MinM5Max0", "-5");
    await setText(t, "BindData_MinM5Max5", "-5");
    await setText(t, "BindData_Min0Max5", "-5");
    await setText(t, "BindData_Min5Max10", "-5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM10MaxM5");
    await checkValid(t, "BindData_MinM5Max0");
    await checkValid(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // -1にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "-1");
    await setText(t, "BindData_MinM5Max0", "-1");
    await setText(t, "BindData_MinM5Max5", "-1");
    await setText(t, "BindData_Min0Max5", "-1");
    await setText(t, "BindData_Min5Max10", "-1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkValid(t, "BindData_MinM5Max0");
    await checkValid(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "0");
    await setText(t, "BindData_MinM5Max0", "0");
    await setText(t, "BindData_MinM5Max5", "0");
    await setText(t, "BindData_Min0Max5", "0");
    await setText(t, "BindData_Min5Max10", "0");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkValid(t, "BindData_MinM5Max0");
    await checkValid(t, "BindData_MinM5Max5");
    await checkValid(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // 1にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "1");
    await setText(t, "BindData_MinM5Max0", "1");
    await setText(t, "BindData_MinM5Max5", "1");
    await setText(t, "BindData_Min0Max5", "1");
    await setText(t, "BindData_Min5Max10", "1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkValid(t, "BindData_MinM5Max5");
    await checkValid(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

    // 5にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "5");
    await setText(t, "BindData_MinM5Max0", "5");
    await setText(t, "BindData_MinM5Max5", "5");
    await setText(t, "BindData_Min0Max5", "5");
    await setText(t, "BindData_Min5Max10", "5");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkValid(t, "BindData_MinM5Max5");
    await checkValid(t, "BindData_Min0Max5");
    await checkValid(t, "BindData_Min5Max10");

    // 6にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "6");
    await setText(t, "BindData_MinM5Max0", "6");
    await setText(t, "BindData_MinM5Max5", "6");
    await setText(t, "BindData_Min0Max5", "6");
    await setText(t, "BindData_Min5Max10", "6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkValid(t, "BindData_Min5Max10");

    // 10にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "10");
    await setText(t, "BindData_MinM5Max0", "10");
    await setText(t, "BindData_MinM5Max5", "10");
    await setText(t, "BindData_Min0Max5", "10");
    await setText(t, "BindData_Min5Max10", "10");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkValid(t, "BindData_Min5Max10");

    // 11にしてエラーを確認
    await setText(t, "BindData_MinM10MaxM5", "11");
    await setText(t, "BindData_MinM5Max0", "11");
    await setText(t, "BindData_MinM5Max5", "11");
    await setText(t, "BindData_Min0Max5", "11");
    await setText(t, "BindData_Min5Max10", "11");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM10MaxM5");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max0");
    await checkInvalidMessageNoChange(t, "BindData_MinM5Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min0Max5");
    await checkInvalidMessageNoChange(t, "BindData_Min5Max10");

});

//----------------------------------------------------------------------
// 最小値+ステップエラーテスト
//----------------------------------------------------------------------
test("最小値+STEPエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // ステップエラーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min2Step3");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM5Step3");
    await clearInput(t, "BindData_Min0Step3");
    await clearInput(t, "BindData_Min2Step3");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5Step3");
    await checkValid(t, "BindData_Min0Step3");
    await checkValid(t, "BindData_Min2Step3");

    // -6にしてエラーを確認
    await addText(t, "BindData_MinM5Step3", "-6");
    await addText(t, "BindData_Min0Step3", "-6");
    await addText(t, "BindData_Min2Step3", "-6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min2Step3");

    // -5にしてエラーを確認
    await setText(t, "BindData_MinM5Step3", "-5");
    await setText(t, "BindData_Min0Step3", "-5");
    await setText(t, "BindData_Min2Step3", "-5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min2Step3");

    // -1にしてエラーを確認
    await setText(t, "BindData_MinM5Step3", "-2");
    await setText(t, "BindData_Min0Step3", "-2");
    await setText(t, "BindData_Min2Step3", "-2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min2Step3");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM5Step3", "0");
    await setText(t, "BindData_Min0Step3", "0");
    await setText(t, "BindData_Min2Step3", "0");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3");
    await checkValid(t, "BindData_Min0Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min2Step3");

    // 1にしてエラーを確認
    await setText(t, "BindData_MinM5Step3", "1");
    await setText(t, "BindData_Min0Step3", "1");
    await setText(t, "BindData_Min2Step3", "1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min2Step3");

    // 2にしてエラーを確認
    await setText(t, "BindData_MinM5Step3", "2");
    await setText(t, "BindData_Min0Step3", "2");
    await setText(t, "BindData_Min2Step3", "2");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step3");
    await checkValid(t, "BindData_Min2Step3");

    // 3にしてエラーを確認
    await setText(t, "BindData_MinM5Step3", "3");
    await setText(t, "BindData_Min0Step3", "3");
    await setText(t, "BindData_Min2Step3", "3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3");
    await checkValid(t, "BindData_Min0Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min2Step3");

    // 5にしてエラーを確認
    await setText(t, "BindData_MinM5Step3", "5");
    await setText(t, "BindData_Min0Step3", "5");
    await setText(t, "BindData_Min2Step3", "5");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3");
    await checkInvalidMessageNoChange(t, "BindData_Min0Step3");
    await checkValid(t, "BindData_Min2Step3");
});

//----------------------------------------------------------------------
// 最大値＋ステップエラーテスト
//----------------------------------------------------------------------
test("最大値＋ステップエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数オーバーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_Max5Step2");
    await clearInput(t, "BindData_Max0Step3");
    await clearInput(t, "BindData_MaxM2Step4");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5Step2");
    await checkValid(t, "BindData_Max0Step3");
    await checkValid(t, "BindData_MaxM2Step4");

    // 6にしてエラーを確認
    await addText(t, "BindData_Max5Step2", "6");
    await addText(t, "BindData_Max0Step3", "6");
    await addText(t, "BindData_MaxM2Step4", "6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // 5にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "5");
    await setText(t, "BindData_Max0Step3", "5");
    await setText(t, "BindData_MaxM2Step4", "5");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // 4にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "4");
    await setText(t, "BindData_Max0Step3", "4");
    await setText(t, "BindData_MaxM2Step4", "4");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // 3にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "3");
    await setText(t, "BindData_Max0Step3", "3");
    await setText(t, "BindData_MaxM2Step4", "3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // 2にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "2");
    await setText(t, "BindData_Max0Step3", "2");
    await setText(t, "BindData_MaxM2Step4", "2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // 1にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "1");
    await setText(t, "BindData_Max0Step3", "1");
    await setText(t, "BindData_MaxM2Step4", "1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // 0にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "0");
    await setText(t, "BindData_Max0Step3", "0");
    await setText(t, "BindData_MaxM2Step4", "0");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5Step2");
    await checkValid(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // -1にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "-1");
    await setText(t, "BindData_Max0Step3", "-1");
    await setText(t, "BindData_MaxM2Step4", "-1");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // -2にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "-2");
    await setText(t, "BindData_Max0Step3", "-2");
    await setText(t, "BindData_MaxM2Step4", "-2");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // -3にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "-3");
    await setText(t, "BindData_Max0Step3", "-3");
    await setText(t, "BindData_MaxM2Step4", "-3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_Max5Step2");
    await checkValid(t, "BindData_Max0Step3");
    await checkInvalidMessageNoChange(t, "BindData_MaxM2Step4");

    // -4にしてエラーを確認
    await setText(t, "BindData_Max5Step2", "-4");
    await setText(t, "BindData_Max0Step3", "-4");
    await setText(t, "BindData_MaxM2Step4", "-4");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_Max5Step2");
    await checkInvalidMessageNoChange(t, "BindData_Max0Step3");
    await checkValid(t, "BindData_MaxM2Step4");

});

//----------------------------------------------------------------------
// 最最小値+最大値＋ステップエラーテスト
//----------------------------------------------------------------------
test("最小値+最大値＋ステップエラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数オーバーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3Max5");

    // クリアしてエラーが無くなることをチェック
    await clearInput(t, "BindData_MinM5Step3Max5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5Step3Max5");

    // -6にしてエラーを確認
    await addText(t, "BindData_MinM5Step3Max5", "-6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3Max5");

    // -5にしてエラーを確認
    await setText(t, "BindData_MinM5Step3Max5", "-5");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5Step3Max5");

    // -4にしてエラーを確認
    await setText(t, "BindData_MinM5Step3Max5", "-4");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3Max5");

    // -3にしてエラーを確認
    await setText(t, "BindData_MinM5Step3Max5", "-3");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3Max5");

    // 0にしてエラーを確認
    await setText(t, "BindData_MinM5Step3Max5", "0");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3Max5");

    // 1にしてエラーを確認
    await setText(t, "BindData_MinM5Step3Max5", "1");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinM5Step3Max5");

    // 5にしてエラーを確認
    await setText(t, "BindData_MinM5Step3Max5", "5");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3Max5");

    // 6にしてエラーを確認
    await setText(t, "BindData_MinM5Step3Max5", "6");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinM5Step3Max5");

});

//----------------------------------------------------------------------
// カウンターボタンテスト(IEのみ)
//----------------------------------------------------------------------
test("カウンターボタンテスト(IEのみ)", async (t) => {
    // IEおよびge場合のみカウントボタンのテストを行う
    // 残念ながら、ChromeやFireFoxで組み込まれているボタンは押せない
    if (t.browser.name === 'Internet Explorer'){

        // 最小値のない入力で加算ボタンをクリックして初期値が0であることをチェック
        await ClickUpCounter(t, 'BindData_Nochek');
        await t.expect(getStringValue('BindData_Nochek')).eql("0");
        await checkValid(t, "BindData_Nochek");

        // もう一度加算ボタンをクリックして1であることをチェック
        await ClickUpCounter(t, 'BindData_Nochek');
        await t.expect(getStringValue('BindData_Nochek')).eql("1");
        await checkValid(t, "BindData_Nochek");

        // さらにしばらく押して2より大きくなっていることを確認（連続アップの確認）
        await longClickUpCounter(t, 'BindData_Nochek');
        await t.expect(getIntegerValue('BindData_Nochek')).gt(2);
        await checkValid(t, "BindData_Nochek");

        // 最小値のない入力で減算ボタンをクリックして初期値が0であることをチェック
        await clearInput(t, "BindData_Nochek");
        await ClickDownCounter(t, 'BindData_Nochek');
        await t.expect(getStringValue('BindData_Nochek')).eql("0");
        await checkValid(t, "BindData_Nochek");

        // もう一度加算ボタンをクリックして-1であることをチェック
        await ClickDownCounter(t, 'BindData_Nochek');
        await t.expect(getStringValue('BindData_Nochek')).eql("-1");
        await checkValid(t, "BindData_Nochek");

        // さらにしばらく押して-2より小さくなっていることを確認（連続アップの確認）
        await longClickDownCounter(t, 'BindData_Nochek');
        await t.expect(getIntegerValue('BindData_Nochek')).lt(-2);
        await checkValid(t, "BindData_Nochek");

        // 最大値が0未満の加算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_MinM10MaxM5");

        // 最小値のない入力で加算ボタンをクリックして初期値が-5であることをチェック
        await ClickUpCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-5");
        await checkValid(t, "BindData_MinM10MaxM5");

        // もう一度加算ボタンをクリックして-5のままであることをチェック
        await ClickUpCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-5");
        await checkValid(t, "BindData_MinM10MaxM5");

        // さらにしばらく押して-5のままであることをチェック
        await longClickUpCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10MaxM5')).eql(-5);
        await checkValid(t, "BindData_MinM10MaxM5");

        // 最大値が0未満の減算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_MinM10MaxM5");

        // 最小値のない入力で減算ボタンをクリックして初期値が-5であることをチェック
        await ClickDownCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-5");
        await checkValid(t, "BindData_MinM10MaxM5");

        await t.wait(1000);

        // もう一度減算ボタンをクリックして-6であることをチェック
        await ClickDownCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-6");
        await checkValid(t, "BindData_MinM10MaxM5");

        // さらにしばらく押して-7未満のままであることをチェック
        await longClickDownCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10MaxM5')).lt(-7);
        await checkValid(t, "BindData_MinM10MaxM5");

        // さらにしばらく押して-10であることをチェック
        await longClickDownCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10MaxM5')).eql(-10);
        await checkValid(t, "BindData_MinM10MaxM5");

        // さらにしばらく押して-10であることをチェック
        await longClickDownCounter(t, 'BindData_MinM10MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10MaxM5')).eql(-10);
        await checkValid(t, "BindData_MinM10MaxM5");

        // 最小値が1以上の加算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_Min5Max10");

        // 最小値のない入力で加算ボタンをクリックして初期値が-5であることをチェック
        await ClickUpCounter(t, 'BindData_Min5Max10');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("5");
        await checkValid(t, "BindData_Min5Max10");

        // もう一度加算ボタンをクリックして6であることをチェック
        await ClickUpCounter(t, 'BindData_Min5Max10');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("6");
        await checkValid(t, "BindData_Min5Max10");

        // さらにしばらく押して8以上であることをチェック
        await longClickUpCounter(t, 'BindData_Min5Max10');
        await t.expect(getIntegerValue('BindData_Min5Max10')).gt(7);
        await checkValid(t, "BindData_Min5Max10");

        // さらにしばらく押して10であることをチェック
        await longClickUpCounter(t, 'BindData_Min5Max10');
        await t.expect(getIntegerValue('BindData_Min5Max10')).eql(10);
        await checkValid(t, "BindData_Min5Max10");

        // さらにしばらく押して10であることをチェック
        await longClickUpCounter(t, 'BindData_Min5Max10');
        await t.expect(getIntegerValue('BindData_Min5Max10')).eql(10);
        await checkValid(t, "BindData_Min5Max10");

        // 最大値が0未満の減算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_Min5Max10");

        // 最小値のない入力で減算算ボタンをクリックして初期値が-5であることをチェック
        await ClickDownCounter(t, 'BindData_Min5Max10');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("5");
        await checkValid(t, "BindData_Min5Max10");

        // もう一度減算ボタンをクリックして5であることをチェック
        await ClickDownCounter(t, 'BindData_Min5Max10');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("5");
        await checkValid(t, "BindData_Min5Max10");

        // さらにしばらく押して5のままであることをチェック
        await longClickDownCounter(t, 'BindData_Min5Max10');
        await t.expect(getIntegerValue('BindData_Min5Max10')).eql(5);
        await checkValid(t, "BindData_Min5Max10");

        // ここからStep有のボタン確認
        // 最小値のない入力で加算ボタンをクリックして初期値が1であることをチェック
        await clearInput(t, "BindData_MinM5Step3Max5");
        await ClickUpCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("1");
        await checkValid(t, "BindData_MinM5Step3Max5");

        // もう一度加算ボタンをクリックして6であることをチェック
        await ClickUpCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("4");
        await checkValid(t, "BindData_MinM5Step3Max5");

        // さらにしばらく押して4であることをチェック
        await longClickUpCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getIntegerValue('BindData_MinM5Step3Max5')).eql(4);
        await checkValid(t, "BindData_Min5Max10");

        // 最小値のない入力で減算算ボタンをクリックして初期値が1であることをチェック
        await clearInput(t, "BindData_MinM5Step3Max5");
        await ClickDownCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("-2");
        await checkValid(t, "BindData_MinM5Step3Max5");

        // もう一度減算ボタンをクリックして-2であることをチェック
        await ClickDownCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("-5");
        await checkValid(t, "BindData_MinM5Step3Max5");

        // さらにしばらく押して-5のままであることをチェック
        await longClickDownCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getIntegerValue('BindData_MinM5Step3Max5')).eql(-5);
        await checkValid(t, "BindData_MinM5Step3Max5");

        // 暫く加算ボタンを押して4であることをチェック
        await longClickUpCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getIntegerValue('BindData_MinM5Step3Max5')).eql(4);
        await checkValid(t, "BindData_Min5Max10");

        // 暫く減算ボタンを押して-5であることをチェック
        await longClickDownCounter(t, 'BindData_MinM5Step3Max5');
        await t.expect(getIntegerValue('BindData_MinM5Step3Max5')).eql(-5);
        await checkValid(t, "BindData_MinM5Step3Max5");

        // 最小値未満で加算クリック
        await setText(t, "BindData_MinM10Step3MaxM5", "-15");
        await ClickUpCounter(t, 'BindData_MinM10Step3MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-10);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // 最小値未満で減算クリック
        await setText(t, "BindData_MinM10Step3MaxM5", "-15");
        await ClickDownCounter(t, 'BindData_MinM10Step3MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-10);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // クリアで加算クリック
        await clearInput(t, "BindData_MinM10Step3MaxM5");
        await ClickUpCounter(t, 'BindData_MinM10Step3MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-7);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // クリアで減算クリック
        await clearInput(t, "BindData_MinM10Step3MaxM5");
        await ClickDownCounter(t, 'BindData_MinM10Step3MaxM5');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-7);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // 最大値より大きい状態で加算クリック
        await setText(t, "BindData_Min5Step3Max10", "15");
        await ClickUpCounter(t, 'BindData_Min5Step3Max10');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(8);
        await checkValid(t, "BindData_Min5Step3Max10");

        // 最大値より大きい状態で減算クリック
        await setText(t, "BindData_Min5Step3Max10", "15");
        await ClickDownCounter(t, 'BindData_Min5Step3Max10');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(8);
        await checkValid(t, "BindData_Min5Step3Max10");

        // クリアで加算クリック
        await clearInput(t, "BindData_Min5Step3Max10");
        await ClickUpCounter(t, 'BindData_Min5Step3Max10');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(5);
        await checkValid(t, "BindData_Min5Step3Max10");

        // クリアで減算クリック
        await clearInput(t, "BindData_Min5Step3Max10");
        await ClickDownCounter(t, 'BindData_Min5Step3Max10');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(5);
        await checkValid(t, "BindData_Min5Step3Max10");


        // ここから同じ操作をキーで行う
        // 加算キーを押して初期値が0であることをチェック
        await clearInput(t, "BindData_Nochek");
        await t.selectText(Selector("#BindData_Nochek")).pressKey('up');
        await t.expect(getStringValue('BindData_Nochek')).eql("0");
        await checkValid(t, "BindData_Nochek");

        // もう一度加算キーを押して1であることをチェック
        await t.selectText(Selector("#BindData_Nochek")).pressKey('up');
        await t.expect(getStringValue('BindData_Nochek')).eql("1");
        await checkValid(t, "BindData_Nochek");

        // testcafeでは連続押しの処理はできない

        // 最小値のない入力で減算ボタンをクリックして初期値が0であることをチェック
        await clearInput(t, "BindData_Nochek");
        await t.selectText(Selector("#BindData_Nochek")).pressKey('down');
        await t.expect(getStringValue('BindData_Nochek')).eql("0");
        await checkValid(t, "BindData_Nochek");

        // もう一度加算ボタンをクリックして-1であることをチェック
        await t.selectText(Selector("#BindData_Nochek")).pressKey('down');
        await t.expect(getStringValue('BindData_Nochek')).eql("-1");
        await checkValid(t, "BindData_Nochek");

        // 最大値が0未満の加算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_MinM10MaxM5");

        // 最小値のない入力で加算ボタンをクリックして初期値が-5であることをチェック
        await t.selectText(Selector("#BindData_MinM10MaxM5")).pressKey('up');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-5");
        await checkValid(t, "BindData_MinM10MaxM5");

        // もう一度加算ボタンをクリックして-5のままであることをチェック
        await t.selectText(Selector("#BindData_MinM10MaxM5")).pressKey('up');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-5");
        await checkValid(t, "BindData_MinM10MaxM5");


        // 最大値が0未満の減算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_MinM10MaxM5");

        // 最小値のない入力で減算ボタンをクリックして初期値が-5であることをチェック
        await t.selectText(Selector("#BindData_MinM10MaxM5")).pressKey('down');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-5");
        await checkValid(t, "BindData_MinM10MaxM5");

        await t.wait(1000);

        // もう一度減算ボタンをクリックして-6であることをチェック
        await t.selectText(Selector("#BindData_MinM10MaxM5")).pressKey('down');
        await t.expect(getStringValue('BindData_MinM10MaxM5')).eql("-6");
        await checkValid(t, "BindData_MinM10MaxM5");

        // 最小値が1以上の加算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_Min5Max10");

        // 最小値のない入力で加算ボタンをクリックして初期値が-5であることをチェック
        await t.selectText(Selector("#BindData_Min5Max10")).pressKey('up');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("5");
        await checkValid(t, "BindData_Min5Max10");

        // もう一度加算ボタンをクリックして6であることをチェック
        await t.selectText(Selector("#BindData_Min5Max10")).pressKey('up');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("6");
        await checkValid(t, "BindData_Min5Max10");


        // 最大値が0未満の減算ボタンの初期値と動作の確認
        await clearInput(t, "BindData_Min5Max10");

        // 最小値のない入力で減算算ボタンをクリックして初期値が-5であることをチェック
        await t.selectText(Selector("#BindData_Min5Max10")).pressKey('down');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("5");
        await checkValid(t, "BindData_Min5Max10");

        // もう一度減算ボタンをクリックして5であることをチェック
        await t.selectText(Selector("#BindData_Min5Max10")).pressKey('down');
        await t.expect(getStringValue('BindData_Min5Max10')).eql("5");
        await checkValid(t, "BindData_Min5Max10");

        // ここからStep有のボタン確認
        // 最小値のない入力で加算ボタンをクリックして初期値が1であることをチェック
        await clearInput(t, "BindData_MinM5Step3Max5");
        await t.selectText(Selector("#BindData_MinM5Step3Max5")).pressKey('up');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("1");
        await checkValid(t, "BindData_MinM5Step3Max5");

        // もう一度加算ボタンをクリックして6であることをチェック
        await t.selectText(Selector("#BindData_MinM5Step3Max5")).pressKey('up');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("4");
        await checkValid(t, "BindData_MinM5Step3Max5");


        // 最小値のない入力で減算算ボタンをクリックして初期値が1であることをチェック
        await clearInput(t, "BindData_MinM5Step3Max5");
        await t.selectText(Selector("#BindData_MinM5Step3Max5")).pressKey('down');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("-2");
        await checkValid(t, "BindData_MinM5Step3Max5");

        // もう一度減算ボタンをクリックして-2であることをチェック
        await t.selectText(Selector("#BindData_MinM5Step3Max5")).pressKey('down');
        await t.expect(getStringValue('BindData_MinM5Step3Max5')).eql("-5");
        await checkValid(t, "BindData_MinM5Step3Max5");


        // 最小値未満で加算クリック
        await setText(t, "BindData_MinM10Step3MaxM5", "-15");
        await t.selectText(Selector("#BindData_MinM10Step3MaxM5")).pressKey('up');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-10);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // 最小値未満で減算クリック
        await setText(t, "BindData_MinM10Step3MaxM5", "-15");
        await t.selectText(Selector("#BindData_MinM10Step3MaxM5")).pressKey('down');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-10);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // クリアで加算クリック
        await clearInput(t, "BindData_MinM10Step3MaxM5");
        await t.selectText(Selector("#BindData_MinM10Step3MaxM5")).pressKey('up');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-7);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // クリアで減算クリック
        await clearInput(t, "BindData_MinM10Step3MaxM5");
        await t.selectText(Selector("#BindData_MinM10Step3MaxM5")).pressKey('down');
        await t.expect(getIntegerValue('BindData_MinM10Step3MaxM5')).eql(-7);
        await checkValid(t, "BindData_MinM10Step3MaxM5");

        // 最大値より大きい状態で加算クリック
        await setText(t, "BindData_Min5Step3Max10", "15");
        await t.selectText(Selector("#BindData_Min5Step3Max10")).pressKey('up');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(8);
        await checkValid(t, "BindData_Min5Step3Max10");

        // 最大値より大きい状態で減算クリック
        await setText(t, "BindData_Min5Step3Max10", "15");
        await t.selectText(Selector("#BindData_Min5Step3Max10")).pressKey('down');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(8);
        await checkValid(t, "BindData_Min5Step3Max10");

        // クリアで加算クリック
        await clearInput(t, "BindData_Min5Step3Max10");
        await t.selectText(Selector("#BindData_Min5Step3Max10")).pressKey('up');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(5);
        await checkValid(t, "BindData_Min5Step3Max10");

        // クリアで減算クリック
        await clearInput(t, "BindData_Min5Step3Max10");
        await t.selectText(Selector("#BindData_Min5Step3Max10")).pressKey('down');
        await t.expect(getIntegerValue('BindData_Min5Step3Max10')).eql(5);
        await checkValid(t, "BindData_Min5Step3Max10");

        // Step刻みでない状態でマウスクリックで加算
        await setText(t, "BindData_MinM5", "-3");
        await ClickUpCounter(t, "BindData_MinM5");
        await t.expect(getIntegerValue('BindData_MinM5')).eql(-2);

        // Step刻みでない状態でキーで加算
        await setText(t, "BindData_MinM5", "-3");
        await t.selectText(Selector("#BindData_MinM5")).pressKey('up');
        await t.expect(getIntegerValue('BindData_MinM5')).eql(-2);

        // Step刻みでない状態でマウスクリックで加算
        await setText(t, "BindData_MinM5", "-3");
        await ClickUpCounter(t, "BindData_MinM5");
        await t.expect(getIntegerValue('BindData_MinM5')).eql(-2);

        // Step刻みでない状態でマウスクリックで加算
        await setText(t, "BindData_MinM5", "-3");
        await ClickUpCounter(t, "BindData_MinM5");
        await t.expect(getIntegerValue('BindData_MinM5')).eql(-2);

    }
});

//----------------------------------------------------------------------
// 正常動作テスト
//----------------------------------------------------------------------
test("正常動作テスト", async (t) => {

    await setText(t, "BindData_Nochek", "13");
    await setText(t, "BindData_Required", "10000");
    await setText(t, "BindData_RequiredErrch", "-1");

    await setText(t, "BindData_MinM5", "-1");
    await setText(t, "BindData_MinM5Errch", "-2");
    await setText(t, "BindData_Min0", "1");
    await setText(t, "BindData_Min2", "3");

    await setText(t, "BindData_Max5", "3");
    await setText(t, "BindData_Max5Errch", "2");
    await setText(t, "BindData_Max0", "-1");
    await setText(t, "BindData_MaxM2", "-3");

    await setText(t, "BindData_Step2", "2");
    await setText(t, "BindData_Step2Errch", "4");
    await setText(t, "BindData_Step3", "9");

    await setText(t, "BindData_MinM10MaxM5", "-6");
    await setText(t, "BindData_MinM5Max0", "-2");
    await setText(t, "BindData_MinM5Max5", "1");
    await setText(t, "BindData_Min0Max5", "3");
    await setText(t, "BindData_Min5Max10", "8");

    await setText(t, "BindData_MinM5Step3", "-5");
    await setText(t, "BindData_Min0Step3", "3");
    await setText(t, "BindData_Min2Step3", "8");

    await setText(t, "BindData_Max5Step2", "-2");
    await setText(t, "BindData_Max0Step3", "-6");
    await setText(t, "BindData_MaxM2Step4", "-8");

    await setText(t, "BindData_MinM5Step3Max5", "1");
    await setText(t, "BindData_MinM10Step3MaxM5", "-7");
    await setText(t, "BindData_Min5Step3Max10", "8");

    await t.click(Selector("#mainsubmit"));

    // 表示チェック
    await t.expect(Selector("#Nochek").textContent).eql("13");
    await t.expect(Selector("#Required").textContent).eql("10000");
    await t.expect(Selector("#RequiredErrch").textContent).eql("-1");

    await t.expect(Selector("#MinM5").textContent).eql("-1");
    await t.expect(Selector("#MinM5Errch").textContent).eql("-2");
    await t.expect(Selector("#Min0").textContent).eql("1");
    await t.expect(Selector("#Min2").textContent).eql("3");

    await t.expect(Selector("#Max5").textContent).eql("3");
    await t.expect(Selector("#Max5Errch").textContent).eql("2");
    await t.expect(Selector("#Max0").textContent).eql("-1");
    await t.expect(Selector("#MaxM2").textContent).eql("-3");

    await t.expect(Selector("#Step2").textContent).eql("2");
    await t.expect(Selector("#Step2Errch").textContent).eql("4");
    await t.expect(Selector("#Step3").textContent).eql("9");

    await t.expect(Selector("#MinM10MaxM5").textContent).eql("-6");
    await t.expect(Selector("#MinM5Max0").textContent).eql("-2");
    await t.expect(Selector("#MinM5Max5").textContent).eql("1");
    await t.expect(Selector("#Min0Max5").textContent).eql("3");
    await t.expect(Selector("#Min5Max10").textContent).eql("8");

    await t.expect(Selector("#MinM5Step3").textContent).eql("-5");
    await t.expect(Selector("#Min0Step3").textContent).eql("3");
    await t.expect(Selector("#Min2Step3").textContent).eql("8");

    await t.expect(Selector("#Max5Step2").textContent).eql("-2");
    await t.expect(Selector("#Max0Step3").textContent).eql("-6");
    await t.expect(Selector("#MaxM2Step4").textContent).eql("-8");

    await t.expect(Selector("#MinM5Step3Max5").textContent).eql("1");
    await t.expect(Selector("#MinM10Step3MaxM5").textContent).eql("-7");
    await t.expect(Selector("#Min5Step3Max10").textContent).eql("8");
});