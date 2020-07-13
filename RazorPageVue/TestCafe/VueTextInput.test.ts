import "testcafe";
import { Selector } from "testcafe";
import { ClientFunction } from "testcafe";

fixture("Vue テキスト入力コンポーネントテスト")
    .page("https://localhost:44357/TextInput");

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
async function isValid(t, id) {
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

//================================================================================
// テスト
//================================================================================

//----------------------------------------------------------------------
// 入力必須テスト
//----------------------------------------------------------------------
test("入力必須テスト", async (t) => {

    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 必須エラーの初期確認
    await isValid(t, "BindData_TextNocheck");
    await checkInvalidMessageNoChange(t, "BindData_TextRequired");
    await checkInvalidMessageChange(t, "BindData_TextRequiredMsgChange");

    // 一旦入力してまたクリアしてのチェック
    await t.typeText(Selector("#BindData_TextNocheck"), "aaa");
    await t.click(Selector("#BindData_TextNocheck"),).pressKey('ctrl+a delete');
    await t.typeText(Selector("#BindData_TextRequired"), "aaa");
    await t.click(Selector("#BindData_TextRequired")).pressKey('ctrl+a delete');
    await t.typeText(Selector("#BindData_TextRequiredMsgChange"), "aaa");
    await t.click(Selector("#BindData_TextRequiredMsgChange")).pressKey('ctrl+a delete');
    
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 必須エラーの再確認
    await isValid(t, "BindData_TextNocheck");
    await checkInvalidMessageNoChange(t, "BindData_TextRequired");
    await checkInvalidMessageChange(t, "BindData_TextRequiredMsgChange");
});

//----------------------------------------------------------------------
// 桁数不足エラーテスト
//----------------------------------------------------------------------
test("桁数不足エラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数不足エラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_TextMinLength");
    await checkInvalidMessageChange(t, "BindData_TextMinLengthMsg");
    
    // クリアしてエラーが無くなることをチェック
    await t.click(Selector("#BindData_TextMinLength")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextMinLengthMsg")).pressKey('ctrl+a delete');
    await t.click(Selector("#mainsubmit"));
    await isValid(t, "BindData_TextMinLength");
    await isValid(t, "BindData_TextMinLengthMsg");

    // 再度桁数エラーを発生させる
    await t.typeText(Selector("#BindData_TextMinLength"), "ああああ");
    await t.typeText(Selector("#BindData_TextMinLengthMsg"), "いいいい");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_TextMinLength");
    await checkInvalidMessageChange(t, "BindData_TextMinLengthMsg");

    // 最大最少の最小部分をチェック
    await t.typeText(Selector("#BindData_TextMinMaxLength"), "いいいい");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_TextMinMaxLength");

});

//----------------------------------------------------------------------
// 桁数オーバーエラーテスト
//----------------------------------------------------------------------
test("桁数オーバーエラーテスト", async (t) => {

    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 文字数オーバーエラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_TextMaxLength");
    await checkInvalidMessageChange(t, "BindData_TextMaxLengthMsg");
    await checkInvalidMessageNoChange(t, "BindData_TextMinMaxLength");

    // クリアしてエラーが無くなることをチェック
    await t.click(Selector("#BindData_TextMaxLength")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextMaxLengthMsg")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextMinMaxLength")).pressKey('ctrl+a delete');
    await t.click(Selector("#mainsubmit"));
    await isValid(t, "BindData_TextMaxLength");
    await isValid(t, "BindData_TextMaxLengthMsg");

    // 桁オーバー入力はTestCafeをフリーズさせるので行わない。（基本的にはどのブラウザも対応しているので不要と思われる）

});

//----------------------------------------------------------------------
// 比較エラーテスト
//----------------------------------------------------------------------
test("比較エラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 比較エラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_TextCompaire2");
    await checkInvalidMessageChange(t, "BindData_TextCompaireMsg2");

    // 比較元をクリアしてエラーチェック
    await t.click(Selector("#BindData_TextCompaire1")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextCompaireMsg1")).pressKey('ctrl+a delete');
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_TextCompaire2");
    await checkInvalidMessageChange(t, "BindData_TextCompaireMsg2");

    // 自身もクリアしてエラー対象外をチェック
    await t.click(Selector("#BindData_TextCompaire2")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextCompaireMsg2")).pressKey('ctrl+a delete');
    await t.click(Selector("#mainsubmit"));
    await isValid(t, "BindData_TextCompaire2");
    await isValid(t, "BindData_TextCompaireMsg2");
});

//----------------------------------------------------------------------
// URL,メールラーテスト
//----------------------------------------------------------------------
test("URL,メールラーテスト", async (t) => {
    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // URL,メールラーの初期確認
    await checkInvalidMessageNoChange(t, "BindData_TextURL");
    await checkInvalidMessageChange(t, "BindData_TextURLMsg");
    await checkInvalidMessageNoChange(t, "BindData_TextEMail");
    await checkInvalidMessageChange(t, "BindData_TextEMailMsg");

    // クリアしてエラーが無くなることをチェック
    await t.click(Selector("#BindData_TextURL")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextURLMsg")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextEMail")).pressKey('ctrl+a delete');
    await t.click(Selector("#BindData_TextEMailMsg")).pressKey('ctrl+a delete');
    await t.click(Selector("#mainsubmit"));
    await isValid(t, "BindData_TextURL");
    await isValid(t, "BindData_TextURLMsg");
    await isValid(t, "BindData_TextEMail");
    await isValid(t, "BindData_TextEMailMsg");
});

//----------------------------------------------------------------------
// 正常動作テスト
//----------------------------------------------------------------------
test("正常動作テスト", async (t) => {
    // 必須エラーを解除
    await t.typeText(Selector("#BindData_TextNocheck"), "バリデーションなし", { replace:true });
    await t.typeText(Selector("#BindData_TextRequired"), "必須入力", { replace: true });
    await t.typeText(Selector("#BindData_TextRequiredMsgChange"), "必須入力メッセージ変更", { replace: true });

    // 桁数不足エラー解除
    await t.typeText(Selector("#BindData_TextMinLength"), "最小桁数エラー", { replace: true });
    await t.typeText(Selector("#BindData_TextMinLengthMsg"), "最小桁数メッセージ変更", { replace: true });

    // 桁数オーバーエラー解除
    await t.click(Selector("#BindData_TextMaxLength")).pressKey("ctrl+a delete");
    await t.click(Selector("#BindData_TextMaxLengthMsg")).pressKey("ctrl+a delete");
    await t.typeText(Selector("#BindData_TextMaxLength"), "最大桁数", { replace: true });
    await t.typeText(Selector("#BindData_TextMaxLengthMsg"), "最大桁数変更", { replace: true });

    // 最小最大
    await t.click(Selector("#BindData_TextMinMaxLength")).pressKey("ctrl+a delete");
    await t.typeText(Selector("#BindData_TextMinMaxLength"), "最小最大桁数", { replace: true });

    // 比較エラー解除
    await t.typeText(Selector("#BindData_TextCompaire1"), "比較", { replace: true });
    await t.typeText(Selector("#BindData_TextCompaire2"), "比較", { replace: true });
    await t.typeText(Selector("#BindData_TextCompaireMsg1"), "比較メッセージ変更", { replace: true });
    await t.typeText(Selector("#BindData_TextCompaireMsg2"), "比較メッセージ変更", { replace: true });

    // URL
    await t.typeText(Selector("#BindData_TextURL"), "http://test.com", { replace: true });
    await t.typeText(Selector("#BindData_TextURLMsg"), "https://test.com", { replace: true });

    // Email
    await t.typeText(Selector("#BindData_TextEMail"), "mailaddress@test.com", { replace: true });
    await t.typeText(Selector("#BindData_TextEMailMsg"), "mailaddressMsg@test.com", { replace: true });


    await t.click(Selector("#mainsubmit"));

    // 表示チェック
    await t.expect(Selector("#TextNocheck").textContent).eql("バリデーションなし");
    await t.expect(Selector("#TextRequired").textContent).eql("必須入力");
    await t.expect(Selector("#TextRequiredMsgChange").textContent).eql("必須入力メッセージ変更");
    await t.expect(Selector("#TextMinLength").textContent).eql("最小桁数エラー");
    await t.expect(Selector("#TextMinLengthMsg").textContent).eql("最小桁数メッセージ変更");
    await t.expect(Selector("#TextMaxLength").textContent).eql("最大桁数");
    await t.expect(Selector("#TextMaxLengthMsg").textContent).eql("最大桁数変更");
    await t.expect(Selector("#TextMinMaxLength").textContent).eql("最小最大桁数");
    await t.expect(Selector("#TextCompaire1").textContent).eql("比較");
    await t.expect(Selector("#TextCompaire2").textContent).eql("比較");
    await t.expect(Selector("#TextCompaireMsg1").textContent).eql("比較メッセージ変更");
    await t.expect(Selector("#TextCompaireMsg2").textContent).eql("比較メッセージ変更");
    await t.expect(Selector("#TextUrl").textContent).eql("http://test.com");
    await t.expect(Selector("#TextUrlMsg").textContent).eql("https://test.com");
    await t.expect(Selector("#TextEmail").textContent).eql("mailaddress@test.com");
    await t.expect(Selector("#TextEmailMsg").textContent).eql("mailaddressMsg@test.com");
});