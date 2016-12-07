# qiita-angular2-sample
キータ投稿用にAngular2で作ったサンプル画面。

<https://silverfox-sample1.appspot.com/>

上記サイトで動作中のサービスを体験できます。  
勉強用のシンプルなサービスですが、GoやAngular2に触れてみたい方はご自由にご利用ください。

## ビルド手順

### 準備

1. cloneする  
`git clone https://github.com/silverfox-vaice/qiita-angular2-sample.git`
2. ディレクトリ移動  
`cd qiita-angular2-sample`
3. npmでnode_modulesをインストール  
`npm install`
4. 



### 本番用ビルド

本番用ビルドはsrcの変更をwatchしません。  
ビルドにも30秒程度かかるため、本来はAppEngineデプロイの際に実行します。

* gulpコマンドで実行  
`gulp build`  
<http://localhost:8100/> で自動で立ち上がります。  
ただし、APIの接続先は<https://silverfox-sample1.appspot.com/>api/なっています。  
接続先をlocalのGo環境に変えたい場合は、ローカルの以下tsファイルを編集してからビルドしてください。  
<https://github.com/silverfox-vaice/qiita-angular2-sample/blob/develop/src/app/configs/app.configs.ts>


### 開発用ビルド

こちらはsrc以下の全ファイルがwatchされており、ソース修正が即座にローカル環境に反映されます。  
**デフォルトではGoのAPIをローカルで起動している必要があります。**


* gulpコマンドで実行  
`gulp local`   
<http://localhost:8200/> で自動で立ち上がります。  
ただし、APIの接続先はhttp://localhost:8080/api/なっています。  
接続先を<https://silverfox-sample1.appspot.com/>api/等に変えたい場合は、ローカルの以下tsファイルを編集してください。  
<https://github.com/silverfox-vaice/qiita-angular2-sample/blob/develop/src/app/configs/app.configs.dev.ts>
