//--------------------------------------------------------------------------------
// Vueの実行
//  【引数】    無し
//--------------------------------------------------------------------------------
function CreateVue(elementId) {
    new Vue({
        el: elementId,
        mounted: function () {
            this.$nextTick(function () {
                // ビュー全体がレンダリングされた後にのみ実行されるコード

                //// 初期のValidateを実行
                //var parent = this.$el.parentNode;
                //while (parent) {
                //    if (parent.tagName.toUpperCase() === "FORM") {
                //        parent.validate();
                //        break;
                //    }
                //    parent = parent.parentNode;
                //}
                
            });
        }
    });
}

//--------------------------------------------------------------------------------
// Number.isIntegerのIE対応（IEのJavaScriptは対応していないのでサポート）
// 整数かどうかの判定
//  【引数】
//      val     ：判定する値
//  【返値】
//      true:整数、false：整数ではない
//--------------------------------------------------------------------------------
function isInteger(val) {
    // 文字列は数値に置きかえる（数値以外が入っているとNunになる）
    if (typeof val === "string" || val instanceof String) {
        if (val.trim().length === 0) return false;
        if (val.match('e') || val.match('E')) return false;   // 一部のブラウザは「1e3」のような指数表記を認めているがこのツールでは除外
        val = Number(val);
    }

    if (val || val === 0) {
        return (typeof val === "number" && isFinite(val) && Math.floor(val) === val);
    }
    else {
        return false;
    }
}

//--------------------------------------------------------------------------------
// Number.isIntegerのIE対応（IEのJavaScriptは対応していないのでサポート）
// 数値かどうかの判定
//  【引数】
//      val     ：判定する値
//  【返値】
//      true:数値、false：数値ではない
//--------------------------------------------------------------------------------
function isNumber(val) {
    // 文字列は数値に置きかえる（数値以外が入っているとNunになる）
    if (typeof val === "string" || val instanceof String) {
        if (val.trim().length === 0) return false;
        val = Number(val);
    }

    if (val || val === 0) {
        return (typeof val === "number" && isFinite(val));
    }
    else {
        return false;
    }
}

//--------------------------------------------------------------------------------
// 時刻かどうかの判定
//  【引数】
//      val     ：判定する値
//  【返値】
//      true:時刻、false：時刻ではない
//--------------------------------------------------------------------------------
function isTime(val, hourMax) {

    if (!hourMax) hourMax = 24;

    if (val) {
        var values = val.split(":");
        if (values.length > 4) return false;

        // 時のチェック
        if (!isNumber(values[0])) return false;
        if (Number(values[0]) >= hourMax) return false;

        // 分のチェック
        if (values.length >= 2) {
            if (!isNumber(values[1])) return false;
            if (Number(values[1]) >= 60) return false;
        }

        // 秒のチェック
        if (values.length >= 3) {
            if (!isNumber(values[2])) return false;
            if (Number(values[2]) >= 60) return false;
        }

        // ミリ秒のチェック
        if (values.length === 4) {
            if (!isNumber(values[3])) return false;
            if (Number(values[3]) >= 1000) return false;
        }

        return true;
    }
    else {
        return false;
    }
}

//--------------------------------------------------------------------------------
// 時刻の比較
//  【引数】
//      timeA   ：比較する値
//      timeB   ：比較する値
//  【返値】
//      timeA < timeB   ：正の値（差分の秒数）
//      timeA = timeB   ：0
//      timeA > timeB   ：負の値（差分の秒数）
//--------------------------------------------------------------------------------
function timeCompare(timeA, timeB) {
    var totalSecondsA = timeToSeconds(timeA);
    var totalSecondsB = timeToSeconds(timeB);

    return totalSecondsB - totalSecondsA;
}

//--------------------------------------------------------------------------------
// 時刻を0:00:00からのトータル秒に変換する
//  【引数】
//      timeStr   ：時刻
//  【返値】
//      トータル秒
//--------------------------------------------------------------------------------
function timeToSeconds(timeStr) {
    var splitTimes = timeStr.split(":");
    var totalSeconds = Number(splitTimes[0]) * 3600;
    if (splitTimes.length >= 2) totalSeconds += Number(splitTimes[1]) * 60;
    if (splitTimes.length >= 3) totalSeconds += Number(splitTimes[2]);
    return totalSeconds;

}

//--------------------------------------------------------------------------------
// 日付かどうかの判定
//  【引数】
//      val     ：判定する値
//  【返値】
//      true:日付、false：日付ではない
//--------------------------------------------------------------------------------
function isDate(val) {

    if (val) {
        var values = val.split("/");
        if (values.length !== 3) return false;

        // 年のチェック
        if (!isNumber(values[0])) return false;
        if (Number(values[0]) <= 0) return false;
        if (Number(values[0]) > 9999) return false;

        // 月のチェック
        if (!isNumber(values[1])) return false;
        if (Number(values[1]) <= 0) return false;
        if (Number(values[1]) > 12) return false;

        // 日のチェック
        if (!isNumber(values[2])) return false;
        if (Number(values[2]) <=0) return false;
        if (Number(values[2]) > 31) return false;

        // 行ったの文字列を日付に変更して年月日を比較
        var dateObj = new Date(val);
        if (dateObj.getFullYear() !== Number(values[0])) return false;
        if (dateObj.getMonth() + 1 !== Number(values[1])) return false;
        if (dateObj.getDate() !== Number(values[2])) return false;

        return true;
    }
    else {
        return false;
    }
}

//--------------------------------------------------------------------------------
// 月の最終日を返す
//  【引数】
//      targetDay   ：対象となる月の日（何日でもよい）
//  【返値】
//      月の最終日
//--------------------------------------------------------------------------------
function getMonthLastDay(targetDay) {
    var monthLast = new Date(targetDay.getFullYear(), targetDay.getMonth(), 0);
    return monthLast.getDate();
}

//--------------------------------------------------------------------------------
// 数値を前に0を付けて特定の長さの文字列にして返す
//  【引数】
//      val     ：数値
//      format  ：数値フォーマット（「0000」等、0で桁数を合わせた文字列）
//  【返値】
//      数値の文字列
//--------------------------------------------------------------------------------
function numberToFixLengthString(val, format) {
    var joinString = format + val.toString();
    return joinString.slice(joinString.length - format.length);
}