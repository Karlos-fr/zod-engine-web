# Zod Engine upstream downloads

This directory is reserved for the most recent artifacts published in the
`Windows`, `Other`, `Zod_engine`, and `Assets` directories of the
[Zod SourceForge project](https://sourceforge.net/projects/zod/files/).

Run the importer from the repository root:

```sh
python3 download/fetch_latest.py
```

The importer selects the newest dated file in every category, downloads it
without unpacking it, and records its category and upstream URL in
`download/manifest.json`.
