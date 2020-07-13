//--------------------------------------------------------------------------------
// 想定のブラウザかどうかのチェック
//  【引数】
//      browser ：想定するブラウザ（MSIE,MSIE11,Edge,Firefox,Safari,Mobile Safari）
//  【返値】
//      true:想定のブラウザ、false:想定のブラウザはない
//--------------------------------------------------------------------------------
function IsBroser(browser) {

    var agent = navigator.userAgent;

    if (browser === "MSIE") {
        if (agent.indexOf("MSIE ") >= 0) return true;
    }
    else if (browser === "MSIE11") {
        if (agent.indexOf("Trident/7") >= 0) return true;
    }
    else if (browser === "Edge") {
        if (agent.indexOf("Edg") >= 0) return true;
    }
    else if (browser === "Firefox") {
        if (agent.indexOf("firefox") >= 0) return true;
    }
    else if (browser === "Safari") {
        if (agent.indexOf("Safari") >= 0 && agent.indexOf("Version") >= 0) {
            if (agent.indexOf("Mobile") >= 0) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    else if (browser === "Mobile Safari") {
        if (agent.indexOf("Safari") >= 0 && agent.indexOf("Version") >= 0) {
            if (agent.indexOf("Mobile") >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    else {
        if (agent.indexOf(browser) >= 0) {
            return CheckVersionUnder(browser + "/");
        }
    }

    return false;
}

//--------------------------------------------------------------------------------
// HTML5のバリデーションエラーが発生しているかどうか（カスタムバリデーションを除く）
//  【引数】
//      validity    ：HTML5のバリデーション情報
//  【返値】
//      true:HTML5のバリデーションエラーが発生している。 false:バリデーションエラーは発生していない
//--------------------------------------------------------------------------------
function IsDefaultValidationError(validity) {

    // デフォルトのバリデートアエラーが有ればtrueを返す
    if (validity.valueMissing ||
        validity.badInput ||
        validity.patternMismatch ||
        validity.rangeOverflow ||
        validity.rangeUnderflow ||
        validity.stepMismatch ||
        validity.tooLong ||
        validity.tooShort ||
        validity.typeMismatch ||
        validity.badInput) {

        return true;
    }
    else {
        return false;
    }
}

//--------------------------------------------------------------------------------
// 入力必須バリデーション
// これに対応していないバリデーションは無いはずなので、基本的にはこれは実行されない
//  【引数】
//      element         ：対象のエレメント
//      required        ：入力必須フラグ
//      errorMessage    ：入力必須のエラーメッセージ（空ならデフォルトメッセージ）
//  【返値】
//      true:エラー無、false:入力必須エラー有
//--------------------------------------------------------------------------------
function RequiredValidation(element, required, errorMessage) {

    if (required) {

        if (!element.value) {
            if (errorMessage) {
                element.setCustomValidity(errorMessage);
            }
            else {
                element.setCustomValidity("入力必須です。");
            }

            return false;
        }
        else {
            return true;
        }
    }

    return true;
}

//--------------------------------------------------------------------------------
// 文字数バリデーション
// tooLongは全て対応してるみたいですが（そもそもMaxLength以上入力できない）
//  【引数】
//      element         ：対象のエレメント
//      maxLength       ：最大文字数
//      maxlengthErrMsg ：最大文字数エラーメッセージ（空ならデフォルトメッセージ）
//      minLength       ：最小文字数
//      minlengthErrMsg ：最小文字数エラーメッセージ（空ならデフォルトメッセージ）
//  【返値】
//      true:エラー無、false:入力必須エラー有
//--------------------------------------------------------------------------------
function StringLengthValidation(element, maxLength, maxlengthErrMsg, minLength, minlengthErrMsg) {

    // 空ならtrue;(Requiredでチェックする)
    if (!element.value) return true;

    // 最大長チェック（ほとんどのブラウザで入力できない様になるので不要と思われる）
    if (maxLength) {
        if (element.value.length > maxLength) {
            if (maxlengthErrMsg) {
                element.setCustomValidity(maxlengthErrMsg);
            }
            else {
                element.setCustomValidity(maxLength + "文字以下で入力してください。");
            }
            return false;
        }
    }

    // 最小長チェック（一部のブラウザでチェックしていない模様）
   if (minLength) {
        if (element.value.length < minLength) {
            if (minlengthErrMsg) {
                element.setCustomValidity(minlengthErrMsg);
            }
            else {
                element.setCustomValidity(minLength + "文字以上で入力してください。");
            }
            return false;
        }
    }

    return true;
}

//--------------------------------------------------------------------------------
// 比較バリデーション
// tooLongは全て対応してるみたいですが（そもそもMaxLength以上入力できない）
//  【引数】
//      element         ：対象のエレメント
//      campareValue    ：比較する値
//      compareErrMsg   ：比較エラーメッセージ（空ならデフォルトメッセージ）
//  【返値】
//      true:エラー無、false:入力必須エラー有
//--------------------------------------------------------------------------------
function CompareValidation(element, campareValue, compareErrMsg) {

    if (element.value) {
        if (campareValue) {
            if (element.value !== campareValue) {
                if (compareErrMsg) {
                    element.setCustomValidity(compareErrMsg);
                }
                else {
                    element.setCustomValidity("内容が一致しません。");
                }
                return false;
            }
        }
        else {
            if (compareErrMsg) {
                element.setCustomValidity(compareErrMsg);
            }
            else {
                element.setCustomValidity("内容が一致しません。");
            }
            return false;
        }
    }
    else {
        if (campareValue) {
            if (compareErrMsg) {
                element.setCustomValidity(compareErrMsg);
            }
            else {
                element.setCustomValidity("内容が一致しません。");
            }
            return false;
            }
        }

    return true;
}

//--------------------------------------------------------------------------------
// 入力必須エラーのメッセージ変更。
// 入力必須エラーが発生していて指定のエラーメッセージがある場合にエラーメッセージを差し替える。
// 差し替えた場合、エラーはカスタムエラーになる
//  【引数】
//      element         ：対象のエレメント
//      requiredErrMsg  ：変更するエラーメッセージ（空なら変更しない）
//  【返値】
//      true:エラー変更、false:エラーを変更していない
//--------------------------------------------------------------------------------
function requiredMsgChange(element, requiredErrMsg) {

    // 必須エラーのメッセージ変換
    if (element.validity.valueMissing) {
        if (requiredErrMsg) {
            element.setCustomValidity(requiredErrMsg);
            return true;
        }
    }
    return false;
}

//--------------------------------------------------------------------------------
// 文字数エラーのメッセージ変更。
// 文字数エラーが発生していて指定のエラーメッセージがある場合にエラーメッセージを差し替える。
// 差し替えた場合、エラーはカスタムエラーになる
//  【引数】
//      element         ：対象のエレメント
//      maxlengthErrMsg ：変更する最大長エラーメッセージ（空なら変更しない）
//      minLengthErrMsg ：変更する最小長エラーメッセージ（空なら変更しない）
//  【返値】
//      true:エラー変更、false:エラーを変更していない
//--------------------------------------------------------------------------------
function stringLengthMsgChange(element, maxlengthErrMsg, minLengthErrMsg) {

    if (element.validity.tooLong) {
        if (maxlengthErrMsg) {
            element.setCustomValidity(maxlengthErrMsg);
            return true;
        }
    }
    else if (element.validity.tooShort) {
        if (minlengthErrMsg) {
            element.setCustomValidity(minLengthErrMsg);
            return true;
        }
    }
    return false;
}

//--------------------------------------------------------------------------------
// 範囲エラーのメッセージ変更。
// 範囲エラーが発生していて指定のエラーメッセージがある場合にエラーメッセージを差し替える。
// 差し替えた場合、エラーはカスタムエラーになる
//  【引数】
//      element         ：対象のエレメント
//      maxErrorMessage ：変更する最大エラーメッセージ（空なら変更しない）
//      minErrorMessage ：変更する最小エラーメッセージ（空なら変更しない）
//      stepErrorMessage：変更する刻み幅エラーメッセージ（空なら変更しない）
//  【返値】
//      true:エラー変更、false:エラーを変更していない
//--------------------------------------------------------------------------------
function rangeMsgChange(element, maxErrorMessage, minErrorMessage, stepErrorMessage) {
    if (element.validity.rangeOverflow) {
        if (maxErrorMessage) {
            element.setCustomValidity(maxErrorMessage);
        }
    }
    else if (element.validity.rangeUnderflow) {
        if (minErrorMessage) {
            element.setCustomValidity(minErrorMessage);
        }
    }
    else if (element.validity.stepMismatch) {
        if (stepErrorMessage) {
            element.setCustomValidity(stepErrorMessage);
        }
    }
}

//--------------------------------------------------------------------------------
// 型エラーのメッセージ変更。
// 型エラーが発生していて指定のエラーメッセージがある場合にエラーメッセージを差し替える。
// 差し替えた場合、エラーはカスタムエラーになる
//  【引数】
//      element         ：対象のエレメント
//      requiredErrMsg  ：変更するエラーメッセージ（空なら変更しない）
//  【返値】
//      true:エラー変更、false:エラーを変更していない
//--------------------------------------------------------------------------------
function typeMismatchMsgChange(element, typeMismatchErrorMessage) {
    if (element.validity.typeMismatch) {
        if (typeMismatchErrorMessage) {
            element.setCustomValidity(typeMismatchErrorMessage);
        }
    }
}