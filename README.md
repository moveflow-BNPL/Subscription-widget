# **Building Your Own Custom Checkout Widget**

To implement your checkout widget, you'll need to install the widget library from your favorite package manager:

```bash
#npm
npm install --save @moveflow/widget

#yarn
yarn add @moveflow/widget
```

You can then import the widget into the component you'd like to render it in



```jsx
import Widget, { WidgetProps } from "@moveflow/widget";
```

Once you have your JSON, you add the file to your project, import it, and use the javascript spread operator to pass it as props to your widget component. See `{...props}` here:

```jsx
import Widget, { WidgetProps } from "@moveflow/widget";

const props: WidgetProps = {
  "ui": {
    "container_border_radius": 10,
    "field_border_radius": 5,
    "button_border_radius": 5,
    "primary_color": "#F143E2",
    "secondary_color": "#ffffff",
    "font_family": "Noto Sans, sans-serif"
  },
  "basic_info": {
    "name": "Subscription Sample",
    "description": "This is a Subscription Sample"
  },
  "payment": [
    {
      "network": "Ethereum",
      "coinType": "ETH",
      "amountType": "fixed",
      "streamRate": 1,
      "rateType": "month",
      "receiver": "",
      "startTime": 1697184728.346,
      "endTime": 1697184728.346
    }
  ]
}

<Widget {...props} />
```
