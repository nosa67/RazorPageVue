import "testcafe";
import { Selector } from "testcafe";
import { ClientFunction } from "testcafe";

fixture("Vue 日付入力コンポーネントテスト")
    .page("https://localhost:44357/DateInput");

//================================================================================
// セレクタ
//================================================================================

//--------------------------------------------------------------------------------
//  カレンダーのテーブルのセルのセレクタ
//  【引数】
//      id      ：入力エレメントid
//      row     ：行（0始まり）
//      col     ：列（0始まり）
//  【返値】
//      カレンダーのテーブルのセルのセレクタ
//--------------------------------------------------------------------------------
const getCalendarCell = Selector((id, row, col) => {
    return (document.getElementById("table_" + id) as HTMLTableElement).getElementsByTagName("tr")[row].getElementsByTagName("td")[col];
});

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

//--------------------------------------------------------------------------------
//  入力エレメントの入力されている値を取得する
//  【引数】
//      id      ：入力エレメントid
//  【返値】
//      入力エレメントの入力されている値
//--------------------------------------------------------------------------------
const getValue = ClientFunction((id) => {
    return (document.getElementById(id) as HTMLInputElement).value;
});

//--------------------------------------------------------------------------------
//  カレンダーのテーブルのセルの値（innerhtml）を取得する
//  【引数】
//      id      ：入力エレメントid
//      row     ：行（0始まり）
//      col     ：列（0始まり）
//  【返値】
//      カレンダーのテーブルのセルの値（innerhtml）
//--------------------------------------------------------------------------------
const getCalendarCellText = ClientFunction((id, row, col) => {
    return (document.getElementById("table_" + id) as HTMLTableElement).getElementsByTagName("tr")[row].getElementsByTagName("td")[col].innerHTML.trim();
});

//--------------------------------------------------------------------------------
//  エレメント内の文字列（innerHtml）の取得
//  【引数】
//      id      ：エレメントid
//  【返値】
//      エレメント内の文字列（innerHtml）
//--------------------------------------------------------------------------------
const getInerHTML = ClientFunction((id) => {
    return document.getElementById(id).innerHTML.trim();
});

//================================================================================
// 共通処理
//================================================================================

//--------------------------------------------------------------------------------
//  ブラウザに応じた入力エレメントのidの取得（ieのみ複合コンポーネントなので異なるIDになる）
//  【引数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//  【返値】
//      入力エレメントのid
//--------------------------------------------------------------------------------
function getInputId(t, id) {
    if (t.browser.name === 'Internet Explorer') {
        return "input_" + id;
    }
    else {
        return id;
    }
}

//----------------------------------------------------------------------
//  入力欄をクリックする
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//      options ：クリックオプション
//----------------------------------------------------------------------
async function clickInput(t, id, options = null) {
    await t.click("#" + getInputId(t, id), options);
}

//----------------------------------------------------------------------
//　日付を入力する
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//      text    ：入力するテキスト
//----------------------------------------------------------------------
async function inputDate(t, id, text) {

    // 入力の日付文字列で「/」を「-」に変更する（testcafeの仕様で、年月日の区切りが「-」の為）
    const text2 = text.replace(/[/]/g, "-");

    await clickInput(t, id, { caretPos:1}); // カレット位置を指定しないと、日が処理対象になってしまう。
    await t.typeText("#" + getInputId(t, id), text2);
}

//----------------------------------------------------------------------
//　日付をクリアする
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function clearDate(t, id) {

    if ((t.browser.name === 'Internet Explorer') || (t.browser.name === 'Edge')) {
        await t.click(Selector("#del_" + id));
    }
    else {
        await inputDate(t, id, "yyyy/mm/dd");
    }
}

//----------------------------------------------------------------------
//　入力内容が一致するかチェックする
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//      expect  ：一致する値
//----------------------------------------------------------------------
async function checkValueEqual(t, id, expect) {

    let expect2 = expect;

    if (t.browser.name !== 'Internet Explorer') {
        expect2 = expect.replace(/[/]/g, "-");
    }
    await t.expect(getValue(getInputId(t, id))).eql(expect2);
}

//----------------------------------------------------------------------
//　入力内容に指定の文字列が含まれているかチェックする
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//      expect  ：含まれている値
//----------------------------------------------------------------------
async function checkValueContain(t, id, expect) {

    let expect2 = expect;

    if ((t.browser.name !== 'Internet Explorer') && (t.browser.name !== 'Edge')) {
        expect2 = expect.replace(/[/]/g, "-");
    }

    await t.expect(getValue(getInputId(t, id))).contains(expect2);
}

//----------------------------------------------------------------------
//  バリデーション正常チェック
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkValid(t, id) {
    const inputId = getInputId(t, id);
    await t.expect(getInputValidity(inputId)).eql(true);
    await t.expect(getValidationMessage(inputId)).eql("");
}

//----------------------------------------------------------------------
//  バリデーション異常チェック（通常メッセージ）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkInvalidMessageNoChange(t, id) {

    const inputId = getInputId(t, id);
    await t.expect(getInputValidity(inputId)).eql(false);
    const elementMessage = getValidationMessage(inputId);
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

    const inputId = getInputId(t, id);
    await t.expect(getInputValidity(inputId)).eql(false);
    await t.expect(getValidationMessage(inputId)).contains("変更");
}

//----------------------------------------------------------------------
//  カレンダーボタンをクリック
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function clickCalenderButton(t, id) {
    await t.click("#dialog_" + id);
}

//----------------------------------------------------------------------
//  実行結果画面のチェック
//  【変数】
//      t       ：テストコンポーネント
//      id      ：エレメントid
//      expect  ：予想される値
//----------------------------------------------------------------------
async function checkResultValue(t, id, expect) {
    await t.expect(getInerHTML(id)).eql(expect);
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
    await checkValid(t, 'BindData_Nochek');
    await checkInvalidMessageNoChange(t, 'BindData_Required');
    await checkInvalidMessageChange(t, 'BindData_RequiredErrch');

    // 一旦入力してまたクリア(クリアボタン)してのチェック
    await inputDate(t, 'BindData_Nochek', "2020/01/01");
    await inputDate(t, 'BindData_Required', "2020/02/03");
    await inputDate(t, 'BindData_RequiredErrch', "2020/04/05");
    await checkValueEqual(t, "BindData_Nochek","2020/01/01");
    await checkValueEqual(t, "BindData_Required","2020/02/03");
    await checkValueEqual(t, "BindData_RequiredErrch","2020/04/05");

    await clearDate(t, 'BindData_Nochek');
    await clearDate(t, 'BindData_Required');
    await clearDate(t, 'BindData_RequiredErrch');

    await t.click(Selector("#mainsubmit"));

    await checkValid(t, 'BindData_Nochek');
    await checkInvalidMessageNoChange(t, 'BindData_Required');
    await checkInvalidMessageChange(t, 'BindData_RequiredErrch');
});

//----------------------------------------------------------------------
// 日付入力テスト(IEのみ)
//----------------------------------------------------------------------
test("日付入力テスト(IEのみ)", async (t) => {
    // IEおよびge場合のみカウントボタンのテストを行う
    // 残念ながら、ChromeやFireFoxで組み込まれているボタンは押せない
    if (t.browser.name === 'Internet Explorer') {

        const today = new Date();

        // 未入力で年を選択して矢印キー上を押したときにシステム日付の当年になることを確認
        await clickInput(t, 'BindData_Nochek', { caretPos:0 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek",today.getFullYear() + "/mm/dd");

        // 入力されている年を選択して矢印キー上を押したときに1年加算されることを確認
        await inputDate(t, 'BindData_Nochek', "2020/03/01");
        await clickInput(t, 'BindData_Nochek', { caretPos: 0 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek","2021/03/01");

        // 未入力で年を選択して矢印キー下を押したときにシステム日付の当年になることを確認
        await clearDate(t, 'BindData_Nochek');
        await clickInput(t, 'BindData_Nochek', { caretPos: 0 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek", today.getFullYear() + "/mm/dd");

        // 入力されている年を選択して矢印キー下を押したときに1年減算されることを確認
        await inputDate(t, 'BindData_Nochek', "2020/03/01");
        await clickInput(t, 'BindData_Nochek', { caretPos: 0 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek", "2019/03/01");

        // 未入力で月を選択して矢印キー上を押したときにシステム日付の当月になることを確認
        await clearDate(t, 'BindData_Nochek');
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek", "yyyy/" + ("00" + (today.getMonth() + 1).toString()).slice(-2) + "/dd");

        // 入力されている月を選択して矢印キー上を押したときに1月加算されることを確認
        await inputDate(t, 'BindData_Nochek', "2020/03/01");
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek","2020/04/01");
        await inputDate(t, 'BindData_Nochek', "2020/01/31");
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek", "2020/02/29");

        // 12月の状態で月を選択し矢印キー上を押したときに翌年の1月になることを確認
        await inputDate(t, 'BindData_Nochek', "2020/12/01");
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek","2020/01/01");

        // 未入力で月を選択して矢印キー下を押したときにシステム日付の当月になることを確認
        await clearDate(t, 'BindData_Nochek');
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek", "yyyy/" + ("00" + (today.getMonth() + 1).toString()).slice(-2) + "/dd");

        // 入力されている月を選択して矢印キー下を押したときに1月減算されることを確認
        await inputDate(t, 'BindData_Nochek', "2020/03/01");
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek","2020/02/01");
        await inputDate(t, 'BindData_Nochek', "2020/03/31");
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek","2020/02/29");

        // 1月の状態で月を選択し矢印キー下を押したときに前年の1月になることを確認
        await inputDate(t, 'BindData_Nochek', "2020/01/01");
        await clickInput(t, 'BindData_Nochek', { caretPos: 6 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek", "2020/12/01");

        // 未入力で日を選択して矢印キー上を押したときにシステム日付の当日になることを確認
        await clearDate(t, 'BindData_Nochek');
        await clickInput(t, 'BindData_Nochek', { caretPos: 9 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek", "yyyy/mm/" + ("00" + today.getDay().toString()).slice(-2));

        // 入力されている日を選択して矢印キー上を押したときに1日加算されることを確認
        await inputDate(t, 'BindData_Nochek', "2020/02/28");
        await clickInput(t, 'BindData_Nochek', { caretPos: 9 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek", "2020/02/29");

        // 月末日の状態で日を選択し矢印キー上を押したときに翌月の1日になることを確認
        await clickInput(t, 'BindData_Nochek', { caretPos: 9 });
        await t.pressKey("up");
        await checkValueEqual(t, "BindData_Nochek", "2020/02/01");

        // 未入力で日を選択して矢印キー下を押したときにシステム日付の当日になることを確認
        await clearDate(t, 'BindData_Nochek');
        await clickInput(t, 'BindData_Nochek', { caretPos: 9 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek", "yyyy/mm/" + ("00" + today.getDay().toString()).slice(-2));

        // 入力されている日を選択して矢印キー下を押したときに1日減算されることを確認
        await inputDate(t, 'BindData_Nochek', "2020/03/31");
        await clickInput(t, 'BindData_Nochek', { caretPos: 9 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek", "2020/03/30");

        // 1日の状態で日を選択し矢印キー下を押したときに前月の月末日になることを確認
        await inputDate(t, 'BindData_Nochek', "2020/03/01");
        await clickInput(t, 'BindData_Nochek', { caretPos: 9 });
        await t.pressKey("down");
        await checkValueEqual(t, "BindData_Nochek", "2020/03/31");

        // 未入力でカレンダーを表示
        await clearDate(t, 'BindData_Nochek');
        await clickCalenderButton(t, "BindData_Nochek");
        await t.expect(getCalendarCellText("BindData_Nochek", 0, 1)).eql(today.getFullYear().toString() + "年");
        await t.expect(getCalendarCellText("BindData_Nochek", 1, 1)).eql((today.getMonth() + 1).toString() + "月");

        // 年を戻る
        await t.click("#prev_year_BindData_Nochek");
        await t.expect(getCalendarCellText("BindData_Nochek", 0, 1)).eql((today.getFullYear() -1).toString() + "年");

        // 年を進める
        await t.click("#post_year_BindData_Nochek");
        await t.expect(getCalendarCellText("BindData_Nochek", 0, 1)).eql((today.getFullYear()).toString() + "年");

        // 月を戻る
        await t.click("#prev_month_BindData_Nochek");
        await t.expect(getCalendarCellText("BindData_Nochek", 1, 1)).eql((today.getMonth()).toString() + "月");

        // 月を進める
        await t.click("#post_month_BindData_Nochek");
        await t.expect(getCalendarCellText("BindData_Nochek", 1, 1)).eql((today.getMonth() + 1).toString() + "月");

        // 選択を中止する
        await t.click("#close_dialog_BindData_Nochek");

        // 日を選択する
        await clickCalenderButton(t, "BindData_Nochek");
        await t.click(getCalendarCell("BindData_Nochek", 4, 4));
        await checkValueContain(t, "BindData_Nochek", today.getFullYear().toString() + "/" + ("00" + (today.getMonth() + 1).toString()).slice(-2) + "/");

        // 日付を入力した状態でカレンダーを表示
        await inputDate(t, 'BindData_Nochek', "2012/02/23");
        await clickCalenderButton(t, "BindData_Nochek");
        await t.expect(getCalendarCellText("BindData_Nochek", 0, 1)).eql("2012年");
        await t.expect(getCalendarCellText("BindData_Nochek", 1, 1)).eql("2月");
        await t.click("#post_year_BindData_Nochek");
        await t.click("#post_month_BindData_Nochek");
        await t.click(getCalendarCell("BindData_Nochek", 4, 4));
        await checkValueContain(t, "BindData_Nochek","2013/03/");

    }

});

//----------------------------------------------------------------------
// 正常動作テスト
//----------------------------------------------------------------------
test("正常動作テスト", async (t) => {

    //----------
    // 必須チェックのないnullのチェック

    // 必須項目の入力
    await inputDate(t, 'BindData_Required', "2020/02/03");
    await inputDate(t, 'BindData_RequiredErrch', "2020/04/05");

    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 結果画面のチェック
    await checkResultValue(t, "Nochek", "")
    await checkResultValue(t, "Required", "2020/02/03")
    await checkResultValue(t, "RequiredErrch", "2020/04/05")
    //----------

    // 結果画面から戻る
    await t.click(Selector("#returnLink"));

    //----------
    // 必須チェックのない入力のチェック

    // 必須項目の入力
    await inputDate(t, 'BindData_Nochek', "2020/05/06");
    await inputDate(t, 'BindData_Required', "2020/02/03");
    await inputDate(t, 'BindData_RequiredErrch', "2020/04/05");

    // submitボタンクリック
    await t.click(Selector("#mainsubmit"));

    // 結果画面のチェック
    await checkResultValue(t, "Nochek", "2020/05/06")
    await checkResultValue(t, "Required", "2020/02/03")
    await checkResultValue(t, "RequiredErrch", "2020/04/05")
    //----------

});
