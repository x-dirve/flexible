# 页端设置基本字体大小模块

用于配合 `postcss-pxtorem` 等模块实现自适应布局的页端模块。

## 使用

- 在项目已启用如 `postcss-pxtorem` 等模块的情况下，在项目入口文件中调用模块并执行
    ```javascript
    import flexible from "@x-drive/flexible";
    flexible();
    ```
- 如果在存在同个域名下有不同项目的情况，为了防止不同项目之间互相干扰，可以在初始化的时候传入特征字符串做为区分
    ```javascript
    import flexible from "@x-drive/flexible";
    flexible("PROJECT_ONE"); // localStorage 中的储存 key 为： FLEXIBLE_UFJPSkVDVF9PTkU=_WINDOW_WIDTH
    ```
    模块默认会尝试将传入的字符串 base64 编码，如不希望被编码可将第二个参数设置为 `true`
    ```javascript
    import flexible from "@x-drive/flexible";
    flexible("PROJECT_ONE", true); // localStorage 中的储存 key 为：FLEXIBLE_PROJECT_ONE_WINDOW_WIDTH
    ```