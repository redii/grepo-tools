import configFileExample from "../config.example.json" with { type: "json" };

export default async (options: any) => {
  const configFile = Bun.file(options.path);

  if (await configFile.exists()) {
    console.info(`❌ Config file already exists under ${options.path}\n\nPlease provide a different path using the --path option`);
    return;
  }

  await Bun.write(options.path, JSON.stringify(configFileExample, null, 2));

  console.info(`✅ Config file was created at ${options.path}\n\nPlease fill in all the required fields!\n\nMore informations can be found at https://github.com/redii/grepo-tools#configuration.`);
}