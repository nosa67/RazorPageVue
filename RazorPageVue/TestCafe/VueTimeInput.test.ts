import "testcafe";
import { Selector } from "testcafe";
import { ClientFunction } from "testcafe";

fixture("Vue 時刻入力コンポーネントテスト")
    .page("https://localhost:44357/TimeInput");

//================================================================================
// クライアント処理
//================================================================================

//--------------------------------------------------------------------------------
//  入力エレメントのバリデーションフラグを取得する
//  【引数】
//      id      ：入力エレメントid
//  【返値】
//      入力エレメントの入力されている値
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
//  入力エレメントの値を取得する
//  【引数】
//      id      ：入力エレメントid
//  【返値】
//      入力エレメントのバリデーションメッセージ
//--------------------------------------------------------------------------------
const getValue = ClientFunction((id) => {
    return (document.getElementById(id) as HTMLInputElement).value;
});

//--------------------------------------------------------------------------------
//  エレメントの時を数値で取得する
//  【引数】
//      id      ：エレメントid
//  【返値】
//      エレメントに入力されている時（数値で）
//--------------------------------------------------------------------------------
const getHour = ClientFunction((id) => {
    return parseInt((document.getElementById(id) as HTMLInputElement).value.substring(0, 2));
});

//--------------------------------------------------------------------------------
//  エレメントの分を数値で取得する
//  【引数】
//      id      ：エレメントid
//  【返値】
//      エレメントに入力されている分（数値で）
//--------------------------------------------------------------------------------
const getMinute = ClientFunction((id) => {
    return parseInt((document.getElementById(id) as HTMLInputElement).value.substring(3, 5));
});

//--------------------------------------------------------------------------------
//  エレメントの秒を数値で取得する
//  【引数】
//      id      ：エレメントid
//  【返値】
//      エレメントに入力されている秒（数値で）
//--------------------------------------------------------------------------------
const getSecond = ClientFunction((id) => {
    return parseInt((document.getElementById(id) as HTMLInputElement).value.substring(6, 8));
});

//--------------------------------------------------------------------------------
//  エレメントの時刻を00:00:00からのトータル秒として取得する
//  【引数】
//      id      ：エレメントid
//  【返値】
//      00:00:00からのトータル秒
//--------------------------------------------------------------------------------
const getTotalSeconds = ClientFunction((id) => {
    const timestr = (document.getElementById(id) as HTMLInputElement).value;
    return parseInt(timestr.substring(0, 2)) * 3600 + parseInt(timestr.substring(3, 5)) * 60 + parseInt(timestr.substring(6, 8));
});

//--------------------------------------------------------------------------------
//  タグ内の文字列の取得
//  【引数】
//      id      ：エレメントid
//  【返値】
//      タグ内のinnerHtml
//--------------------------------------------------------------------------------
const getInerHTML = ClientFunction((id) => {
    return document.getElementById(id).innerHTML.trim();
});

//================================================================================
// 共通処理
//================================================================================

//--------------------------------------------------------------------------------
//  ブラウザに応じた入力エレメントのIDを取得する
//  【引数】
//      t       ：テストコンポーネント
//      id      ：エレメントid
//  【返値】
//      入力エレメントのID
//--------------------------------------------------------------------------------
function getInputElementId(t, id) {
    if (t.browser.name === 'Internet Explorer'){
        return "input_" + id;
    }
    else {
        return id;
    }
}

//----------------------------------------------------------------------
//  バリデーション正常チェック
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkValid(t, id) {

    const changedId = getInputElementId(t, id);
    await t.expect(getInputValidity(changedId)).eql(true);
    await t.expect(getValidationMessage(changedId)).eql("");
}

//----------------------------------------------------------------------
//  バリデーション異常チェック（通常メッセージ）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function checkInvalidMessageNoChange(t, id) {
    const changedId = getInputElementId(t, id);
    await t.expect(getInputValidity(changedId)).eql(false);
    const elementMessage = getValidationMessage(changedId);
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
    const changedId = getInputElementId(t, id);
    await t.expect(getInputValidity(changedId)).eql(false);
    await t.expect(getValidationMessage(changedId)).contains("変更");
}

//----------------------------------------------------------------------
//　時刻入力はこの関数の処理でないと、普通に入力できない（クリックした時のカーソル制御がおかしくなってしまう）
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//      text    ：入力するテキスト
//----------------------------------------------------------------------
async function inputTime(t, id, text) {
    const inputSelector = "#" + getInputElementId(t, id);
    await t.click(inputSelector, { caretPos:1 });
    await t.typeText(inputSelector, text);
    if ((t.browser.name !== 'Internet Explorer') && (t.browser.name !== 'Edge'))  await t.pressKey('enter');
}

//----------------------------------------------------------------------
//　時刻をクリアする。IEではクリアボタンでクリア、それ以外では「--:--」を入力してクリアする
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function clearTime(t, id) {
    if (t.browser.name === 'Internet Explorer') {
        await t.click("#del_" + id);
    }
    else {
        await inputTime(t, id, "--:--");
        await t.pressKey('enter');
    }
}

//----------------------------------------------------------------------
//　DELキーで時刻をクリアする。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function delClear(t, id) {
    const changedId = "#" + getInputElementId(t, id);
    await t.click(changedId);
    await t.pressKey('delete');
}

//----------------------------------------------------------------------
//　BSキーで時刻をクリアする。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function bsClear(t, id) {
    await t.click("#" + getInputElementId(t, id));
    await t.pressKey('backspace');
}

//----------------------------------------------------------------------
//　時をクリックする。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function clickHoour(t, id) {
    await t.click("#" + getInputElementId(t, id), { caretPos: 1 });
}

//----------------------------------------------------------------------
//　分をクリックする。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function clickMinute(t, id) {
    await t.click("#" + getInputElementId(t, id), { caretPos: 4 });
}

//----------------------------------------------------------------------
//　秒をクリックする。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function clickSecond(t, id) {
    await t.click("#" + getInputElementId(t, id), { caretPos: 7 });
}

//--------------------------------------------------------------------------------
//  時刻文字列を00:00:00からのトータル秒として取得する
//  【引数】
//      timestr     ：時刻文字列
//  【返値】
//      00:00:00からのトータル秒
//--------------------------------------------------------------------------------
function timeToTotalSeconds(timestr: string) {
    return parseInt(timestr.substring(0, 2)) * 3600 + parseInt(timestr.substring(3, 5)) * 60 + parseInt(timestr.substring(6, 8));
}

//----------------------------------------------------------------------
//  加算ボタンをクリックする。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function ClickUpCounter(t, id) {
    await t.click("#up_" + id);
    return t;
}

//----------------------------------------------------------------------
//  減算ボタンをクリックする。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function ClickDownCounter(t, id) {
    await t.click("#down_" + id);
    return t;
}

//----------------------------------------------------------------------
//  一定時間加算ボタンをクリックする(実際にはドラッグで少し移動している)。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function longClickUpCounter(t, id) {
    await t.drag("#up_" +id, 5, 0, { speed: 0.01 });
    return t;
}

//----------------------------------------------------------------------
//  一定時間減算ボタンをクリックする(実際にはドラッグで少し移動している)。IEテスト専用
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
//----------------------------------------------------------------------
async function longClickDownCounter(t, id) {
    await t.drag("#down_" +id, 5, 0, { speed: 0.01 });
    return t;
}

//----------------------------------------------------------------------
//  実行結果画面のチェック
//  【変数】
//      t       ：テストコンポーネント
//      id      ：入力エレメントid
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
    await checkValid(t, 'BindData_NormalTimeSpan');
    await checkInvalidMessageNoChange(t, 'BindData_RequiredTimeSpan');
    await checkInvalidMessageChange(t, 'BindData_RequiredTimeSpanChange');

    // 一旦入力してまたクリア(クリアボタン)してのチェック
    await inputTime(t, 'BindData_NormalTimeSpan', "12:00");
    await inputTime(t, 'BindData_RequiredTimeSpan', "07:08");
    await inputTime(t, 'BindData_RequiredTimeSpanChange', "22:22");

    await clearTime(t, 'BindData_NormalTimeSpan');
    await clearTime(t, 'BindData_RequiredTimeSpan');
    await clearTime(t, 'BindData_RequiredTimeSpanChange');

    await t.click(Selector("#mainsubmit"));

    await checkValid(t, 'BindData_NormalTimeSpan');
    await checkInvalidMessageNoChange(t, 'BindData_RequiredTimeSpan');
    await checkInvalidMessageChange(t, 'BindData_RequiredTimeSpanChange');
});

//----------------------------------------------------------------------
// 最小値エラーテスト
//----------------------------------------------------------------------
test("最小値エラーテスト", async (t) => {

    // 初期文字数不足エラーの初期確認
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinTimeSpan");
    await checkInvalidMessageChange(t, "BindData_MinErrTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_MinTimeSpan');
    await clearTime(t, 'BindData_MinErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_MinTimeSpan');
    await checkValid(t, 'BindData_MinErrTimeSpan');

    // 1:05にしてエラーを確認
    await inputTime(t, 'BindData_MinTimeSpan', "01:05");
    await inputTime(t, 'BindData_MinErrTimeSpan', "01:05");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MinTimeSpan");
    await checkInvalidMessageChange(t, "BindData_MinErrTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_MinTimeSpan');
    await clearTime(t, 'BindData_MinErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_MinTimeSpan');
    await checkValid(t, 'BindData_MinErrTimeSpan');

    // 1:10にしてエラーを確認
    await inputTime(t, 'BindData_MinTimeSpan', "01:10");
    await inputTime(t, 'BindData_MinErrTimeSpan', "01:10");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinTimeSpan");
    await checkInvalidMessageChange(t, "BindData_MinErrTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_MinTimeSpan');
    await clearTime(t, 'BindData_MinErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_MinTimeSpan');
    await checkValid(t, 'BindData_MinErrTimeSpan');

    // 1:15にしてエラーを確認
    await inputTime(t, 'BindData_MinTimeSpan', "01:15");
    await inputTime(t, 'BindData_MinErrTimeSpan', "01:15");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MinTimeSpan");
    await checkValid(t, "BindData_MinErrTimeSpan");


});

//----------------------------------------------------------------------
// 最大値エラーテスト
//----------------------------------------------------------------------
test("最大値エラーテスト", async (t) => {

    // 初期文字数不足エラーの初期確認
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MaxTimeSpan");
    await checkInvalidMessageChange(t, "BindData_MaxErrTimeSpan");
                                        
    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_MaxTimeSpan');
    await clearTime(t, 'BindData_MaxErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_MaxTimeSpan');
    await checkValid(t, 'BindData_MaxErrTimeSpan');

    // 23:20にしてエラーを確認
    await inputTime(t, 'BindData_MaxTimeSpan', "23:20");
    await inputTime(t, 'BindData_MaxErrTimeSpan', "23:20");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_MaxTimeSpan");
    await checkInvalidMessageChange(t, "BindData_MaxErrTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_MaxTimeSpan');
    await clearTime(t, 'BindData_MaxErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_MaxTimeSpan');
    await checkValid(t, 'BindData_MaxErrTimeSpan');

    // 23:10にしてエラーを確認
    await inputTime(t, 'BindData_MaxTimeSpan', "23:10");
    await inputTime(t, 'BindData_MaxErrTimeSpan', "23:10");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MaxTimeSpan");
    await checkInvalidMessageChange(t, "BindData_MaxErrTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_MaxTimeSpan');
    await clearTime(t, 'BindData_MaxErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_MaxTimeSpan');
    await checkValid(t, 'BindData_MaxErrTimeSpan');

    // 22:55にしてエラーを確認
    await inputTime(t, 'BindData_MaxTimeSpan', "22:55");
    await inputTime(t, 'BindData_MaxErrTimeSpan', "22:55");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_MaxTimeSpan");
    await checkValid(t, "BindData_MaxErrTimeSpan");


});

//----------------------------------------------------------------------
// ステップエラーテスト
//----------------------------------------------------------------------
test("ステップエラーテスト", async (t) => {

    // 初期文字数不足エラーの初期確認
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_StepTimeSpan");
    await checkInvalidMessageChange(t, "BindData_StepErrTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_StepTimeSpan');
    await clearTime(t, 'BindData_StepErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_StepTimeSpan');
    await checkValid(t, 'BindData_StepErrTimeSpan');

    // 10:20:32にしてエラーを確認
    await inputTime(t, 'BindData_StepTimeSpan', "10:20:32");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageNoChange(t, "BindData_StepTimeSpan");

    // 10:20:30にしてエラーを確認
    await inputTime(t, 'BindData_StepTimeSpan', "10:20:30");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_StepTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_StepTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_StepTimeSpan');

    // 10:11にしてエラーを確認
    await inputTime(t, 'BindData_StepErrTimeSpan', "10:11");
    await t.click(Selector("#mainsubmit"));
    await checkInvalidMessageChange(t, "BindData_StepErrTimeSpan");

    // クリアしてエラーが無くなることをチェック
    await clearTime(t, 'BindData_StepErrTimeSpan');
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, 'BindData_StepErrTimeSpan');

    // 10:10にしてエラーを確認
    await inputTime(t, 'BindData_StepErrTimeSpan', "10:10");
    await t.click(Selector("#mainsubmit"));
    await checkValid(t, "BindData_StepErrTimeSpan");

});

//----------------------------------------------------------------------
// カウンターボタンテスト(IEのみ)
//----------------------------------------------------------------------
test("カウンターボタンテスト(IEのみ)", async (t) => {
    // IEおよびge場合のみカウントボタンのテストを行う
    // 残念ながら、ChromeやFireFoxで組み込まれているボタンは押せない
    if (t.browser.name === 'Internet Explorer') {

        // 一旦入力してまたクリア（DELキー）してのチェック
        await inputTime(t, 'BindData_NormalTimeSpan', "12:00");
        await inputTime(t, 'BindData_RequiredTimeSpan', "07:08");
        await inputTime(t, 'BindData_RequiredTimeSpanChange', "22:22");

        await checkValid(t, 'BindData_NormalTimeSpan');
        await checkValid(t, 'BindData_RequiredTimeSpan');
        await checkValid(t, 'BindData_RequiredTimeSpanChange');

        await delClear(t, 'BindData_NormalTimeSpan');
        await delClear(t, 'BindData_RequiredTimeSpan');
        await delClear(t, 'BindData_RequiredTimeSpanChange');

        await t.click(Selector("#mainsubmit"));

        await checkValid(t, 'BindData_NormalTimeSpan');
        await checkInvalidMessageNoChange(t, 'BindData_RequiredTimeSpan');
        await checkInvalidMessageChange(t, 'BindData_RequiredTimeSpanChange');

        // 一旦入力してまたクリア（BSキー）してのチェック
        await inputTime(t, 'BindData_NormalTimeSpan', "12:00");
        await inputTime(t, 'BindData_RequiredTimeSpan', "07:08");
        await inputTime(t, 'BindData_RequiredTimeSpanChange', "22:22");

        await bsClear(t, 'BindData_NormalTimeSpan');
        await bsClear(t, 'BindData_RequiredTimeSpan');
        await bsClear(t, 'BindData_RequiredTimeSpanChange');

        await t.click(Selector("#mainsubmit"));

        await checkValid(t, 'BindData_NormalTimeSpan');
        await checkInvalidMessageNoChange(t, 'BindData_RequiredTimeSpan');
        await checkInvalidMessageChange(t, 'BindData_RequiredTimeSpanChange');

        // 時を選択して加算ボタンをクリックして初期値が"01:--"であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickHoour(t, 'BindData_NormalTimeSpan');
        await ClickUpCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("01:--");

        // さらに加算をしばらく押して時が2より大きくなることを確認
        await longClickUpCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getHour('input_BindData_NormalTimeSpan')).gt(2);

        // 時を選択して減算ボタンをクリックして初期値が"231:--"であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickHoour(t, 'BindData_NormalTimeSpan');
        await ClickDownCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("23:--");

        // さらに減算をしばらく押して時が22より小さくなることを確認
        await longClickDownCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getHour('input_BindData_NormalTimeSpan')).lt(22);

        // 分を選択して加算ボタンをクリックして初期値が「--:01」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await ClickUpCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("00:01");

        // さらに加算をしばらく押して分が2より大きくなることを確認
        await longClickUpCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getMinute('input_BindData_NormalTimeSpan')).gt(2);

        // 分を選択して減算ボタンをクリックして初期値が「23:59」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await ClickDownCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("23:59");

        // さらに減算をしばらく押して分が58より小さくなることを確認
        await longClickDownCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getMinute('input_BindData_NormalTimeSpan')).lt(58);

        // 分を選択して59を設定し加算ボタンをクリックして「01:00」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('5');
        await t.pressKey('9');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await ClickUpCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("01:00");

        // 分を選択して00を設定し減算ボタンをクリックして「23:59」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('0');
        await t.pressKey('0');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await ClickDownCounter(t, 'BindData_NormalTimeSpan');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("23:59");

        // 秒を選択して加算ボタンをクリックして初期値が「--:01」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await ClickUpCounter(t, 'BindData_StepTimeSpan');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("00:00:10");

        // さらに加算をしばらく押して分が2より大きくなることを確認
        await longClickUpCounter(t, 'BindData_StepTimeSpan');
        await t.expect(getSecond('input_BindData_StepTimeSpan')).gt(2);

        // 秒を選択して減算ボタンをクリックして初期値が「23:59:59」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await ClickDownCounter(t, 'BindData_StepTimeSpan');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("23:59:50");

        // さらに減算をしばらく押して分が58より小さくなることを確認
        await longClickDownCounter(t, 'BindData_StepTimeSpan');
        await t.expect(getTotalSeconds('BindData_StepTimeSpan')).lt(timeToTotalSeconds("23:59:40"));

        // 秒を選択して59を設定し加算ボタンをクリックして「00:01:00」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('5');
        await t.pressKey('9');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await ClickUpCounter(t, 'BindData_StepTimeSpan');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("00:01:00");

        // 秒を選択して00を設定し減算ボタンをクリックして「23:59:50」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('0');
        await t.pressKey('0');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await ClickDownCounter(t, 'BindData_StepTimeSpan');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("23:59:50");



        // 時を選択して加算キーをクリックして初期値が"01:--"であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickHoour(t, 'BindData_NormalTimeSpan');
        await t.pressKey('up');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("01:--");

        // さらに加算をしばらく押して時が2より大きくなることを確認
        await t.pressKey('up');
        await t.pressKey('up');
        await t.expect(getHour('input_BindData_NormalTimeSpan')).gt(2);

        // 時を選択して減算ボタンをクリックして初期値が"231:--"であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickHoour(t, 'BindData_NormalTimeSpan');
        await t.pressKey('down');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("23:--");

        // さらに減算をしばらく押して時が22より小さくなることを確認
        await t.pressKey('down');
        await t.pressKey('down');
        await t.expect(getHour('input_BindData_NormalTimeSpan')).lt(22);

        // 分を選択して加算ボタンをクリックして初期値が「--:01」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('up');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("00:01");

        // さらに加算をしばらく押して分が2より大きくなることを確認
        await t.pressKey('up');
        await t.pressKey('up');
        await t.expect(getMinute('input_BindData_NormalTimeSpan')).gt(2);

        // 分を選択して減算ボタンをクリックして初期値が「23:59」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('down');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("23:59");

        // さらに減算をしばらく押して分が58より小さくなることを確認
        await t.pressKey('down');
        await t.pressKey('down');
        await t.expect(getMinute('input_BindData_NormalTimeSpan')).lt(58);

        // 分を選択して59を設定し加算ボタンをクリックして「01:00」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('5');
        await t.pressKey('9');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('up');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("01:00");

        // 分を選択して00を設定し減算ボタンをクリックして「23:59」であることをチェック
        await clearTime(t, 'BindData_NormalTimeSpan');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('0');
        await t.pressKey('0');
        await clickMinute(t, 'BindData_NormalTimeSpan');
        await t.pressKey('down');
        await t.expect(getValue('input_BindData_NormalTimeSpan')).contains("23:59");

        // 秒を選択して加算ボタンをクリックして初期値が「--:01」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('up');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("00:00:10");

        // さらに加算をしばらく押して分が2より大きくなることを確認
        await t.pressKey('up');
        await t.pressKey('up');
        await t.expect(getSecond('input_BindData_StepTimeSpan')).gt(2);

        // 秒を選択して減算ボタンをクリックして初期値が「23:59:59」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('down');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("23:59:50");

        // さらに減算をしばらく押して分が58より小さくなることを確認
        await t.pressKey('down');
        await t.pressKey('down');
        await t.expect(getTotalSeconds('BindData_StepTimeSpan')).lt(timeToTotalSeconds("23:59:40"));

        // 秒を選択して59を設定し加算ボタンをクリックして「00:01:00」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('5');
        await t.pressKey('9');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('up');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("00:01:00");

        // 秒を選択して00を設定し減算ボタンをクリックして「23:59:50」であることをチェック
        await clearTime(t, 'BindData_StepTimeSpan');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('0');
        await t.pressKey('0');
        await clickSecond(t, 'BindData_StepTimeSpan');
        await t.pressKey('down');
        await t.expect(getValue('input_BindData_StepTimeSpan')).contains("23:59:50");
    }
});

//----------------------------------------------------------------------
// 正常動作テスト
//----------------------------------------------------------------------
test("正常動作テスト", async (t) => {

    await inputTime(t, 'BindData_RequiredTimeSpan', "12:00");
    await inputTime(t, 'BindData_RequiredTimeSpanChange', "12:01");
    await inputTime(t, 'BindData_MinTimeSpan', "13:00");
    await inputTime(t, 'BindData_MinErrTimeSpan', "13:02");
    await inputTime(t, 'BindData_MaxTimeSpan', "14:00");
    await inputTime(t, 'BindData_MaxErrTimeSpan', "14:03");
    await inputTime(t, 'BindData_StepTimeSpan', "15:00:20");
    await inputTime(t, 'BindData_StepErrTimeSpan', "15:05");
    await inputTime(t, 'BindData_MinMaxStepTimeSpan', "15:15");

    await t.click(Selector("#mainsubmit"));

    await checkResultValue(t, "NormalTimeSpan", "")
    await checkResultValue(t, "RequiredTimeSpan", "12:00:00")
    await checkResultValue(t, "RequiredTimeSpanChange", "12:01:00")
    await checkResultValue(t, "MinTimeSpan", "13:00:00")
    await checkResultValue(t, "MinErrTimeSpan", "13:02:00")
    await checkResultValue(t, "MaxTimeSpan", "14:00:00")
    await checkResultValue(t, "MaxErrTimeSpan", "14:03:00")
    await checkResultValue(t, "StepTimeSpan", "15:00:20")
    await checkResultValue(t, "StepErrTimeSpan", "15:05:00")
    await checkResultValue(t, "MinMaxStepTimeSpan", "15:15:00")
});
