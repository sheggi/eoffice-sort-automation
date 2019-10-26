E-Office Sort Automation
---

This tool ist intended to select file per filters and apply actions to it. The rules are configured in a `config.json` file

Setup and Run
===

```bash
npm i
node index
```


Example Configuration
===

First define the directory to work on and then define the filters and actions to be used by rules;

```json
{
  "version": 1,
  "directory": "D:\\Users\\Joel\\Downloads",
  "filters": [
    {
      "@type": "FileConditionFilter",
      "id": "txt-file-filter",
      "condition": [
        {
          "property": "name",
          "regexp": "\/\\.txt$\/"
        }
      ]
    }
  ],
  "actions": [
    {
      "@type": "MoveToAction",
      "id": "move-to-test",
      "destination": "D:\\development\\eoffice-sort-automation\\local\\target"
    }
  ],
  "rules": [
    {
      "filter": "txt-file-filter",
      "action": "move-to-test"
    }
  ]
}
```

Help from
===
https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
