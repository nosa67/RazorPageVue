ASP.Net CoreのRazor Page上で、non-SPAでVueを利用した入力コンポーネントのサンプル

【目的と概要】

　目的はタイトルにあるようにRazorPageを利用してnon-SPAなVueコンポーネントを利用することで、HTML5のtype属性やバリデーションを活用した
再利用可能な入力コンポーネントの作成を行うサンプルです。
　技術的な要素としてはそのほかにASP.Net Coreのタグヘルパーやバリデーションアトリビュート、テストの為にTestCafeを利用しています。
　また、なかなかなくなりそうにないIE11もサポートするような仕組みを作ってみました。
　開発の経緯やソースの説明はQiitaの「https://qiita.com/nosa67」に記載している記事を参照してください。ここでの記事の最終成果物として本ソースをGitHubで公開していますが、
記事時点のソースから内容を整理していますので、記事の中のソースとは若干異なります。
　コンポーネント作成では意図的に連携できるサーバー側のデータタイプを制限することで、ブラウザとサーバのインピーダンスミスマッチを是正するようにしています。

【内容】
　Vueコンポーネント
　　vueCheckButton  ：複数選択可能なチェックボタン
　　vueRadioButton  ：未選択可能なラジオボタン
　　vueTextInput    ：テキスト入力
　　vueIntegerInput ：整数入力
　　vueRealInput    ：実数入力
　　vueTimeInput    ：時刻入力（サーバーではTimeSpan）
　　vueDateInput    ：日付入力（サーバーではDateTime）
 バリデーション属性
　　Required　　　　：入力必須
　　StringLength　　：テキストの、最小長、最大長
　　Range　　　　　 ：整数、実数、時刻の最小、最大、ステップ
　　Email　　　　　 ：メールアドレスかどうか
　　Url　　　　　　 ；URLかどうか
　　Compare　　　　 ：２つのテキストの同一性