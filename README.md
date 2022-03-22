## Plugin for generating gallery folders with photos

The plugin creates folders with photos, the list of photos is displayed on a separate page.
A modified FancyBox 3 library is embedded inside the plugin, with the addition of a callback form.
The Fancybox script can be disabled.

### Start using the plugin

For the plugin to work, you need to connect standard styles and scripts in the template or on the page:

```bash
# in the tag head:
{% styles %}

# at the end of the tag body. If you use the built-in Funcybox:
{% framework extras %}
{% scripts %}
```

You need to connect the components and insert them in the right place in the code

```bash
{% component 'galleryList' %}
```

---

To display the album photo list, create a page with a variable in the URL, for example: **/gallery/:slug**

**:slug** - is a standard variable, you can set your variable by adding the desired value to the Identifier value field in the galleryDetails component

Connect the galleryDetails component to the page and initialize it in the right place to display a list of photos

```bash
{% component 'galleryDetails' %}
```


