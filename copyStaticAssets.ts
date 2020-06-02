import * as shell from "shelljs";

shell.cp("-R", "src/public/js/lib", "dist/public/js/");
shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/swagger", "dist/");
shell.cp("-R", "web-client/build/*", "dist/public/");
shell.ls("dist/swagger/*.yaml").forEach((file) => {
  if (process.env.SWAGGER_ENV === "production") {
    shell.sed(
      "-i",
      "{{SWAGGER_SERVER_URL}}",
      process.env.SWAGGER_SERVER_URL,
      file
    );
  } else {
    shell.sed(
      "-i",
      "{{SWAGGER_SERVER_URL}}",
      "http://localhost:3000/api",
      file
    );
  }
});
