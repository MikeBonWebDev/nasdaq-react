> [!NOTE]
> [See preview on GitHub Pages](https://mikebonwebdev.github.io/nasdaq-react-ghpages)

[Visualizza in italiano](./LEGGIMI.md)
# Stock Market Dashboard

This is a Web App builded using **React.js**, for monitoring and view stock values through interactive and fresh UI

## Summary:

- [Core Function](README.md#core-functions)
- [Usage](README.MD#usage)
- [Technologies Employed](README.md#technologies-employed)
- [Contributions](README.md#contributions)

## Core functions

- **Searching Stock**: Application allowed users search stock values typing inside a text input and, for this moment, the input is restricted **only to company _acronyms_**: Input be used to query a API obtaining stock's required data.
- **Refresh Stock**: Is also possible manually update data's stock pressing a button. It allowed to obtain recent info.
- **Volatility chart**: A graph is displayed showing the stock's volatility over time, offering a visual representation of how values have changed.
- **Auto-Refresh**: A switch button allows you to activate automatic data refresh at one-minute intervals, guaranteeing always up-to-date information.
- **Stock Elimination**: Users can delete previously viewed stocks via a dedicated button, ensuring personalized management of the stock list.

## Usage

- Clone Repository on your device.
- Install dependance with `npm install`.
- Start application using `npm start`.
- If you want to build your application run `npm build`[^1].

Running app, you can:

- Type stock's name inside input text and start search.
- If it success, a preview square with acronym and date will add under search box.
- Clicking on preview square will show a selected stock details.
- You can manually refresh data with dedicated button.
- Using switch button you can activate auto-refresh(1min).
- View volatility graph to see the variation.
- Delete details stock from view using cross button on top-right.

## Technologies employed
- ***React.js***: Main framework/library for app deploying.
- ***Alpha Vantage***, Stock Market API: Queried to obtain stock data.
- **Additional Libraries**: 
  - ***Bootstrap***: Responsive e presetted items.
  - ***Recharts***: graph items.
  - ***Fontawsome***: icon items.

## [Contributions](README.md#contributionscontributions)
Contributions to improve the application are welcome. Feel free to open an issue for suggestions or bug reports, or submit a pull request to contribute code directly.

[^1]: Could be problems with URL path from deploy to build. Actually I solved this manually editing path inside a build dir.


