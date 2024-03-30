class AsyncBuilder {
  private context: string;
  private tasks: (() => Promise<void>)[] = [];

  private constructor(contextFactory: () => Promise<string>) {
    this.tasks.push(async () => {
      const context = await contextFactory();
      this.context = context;
    });
  }

  public static fromNumber(num: number) {
    return new AsyncBuilder(async () => {
      return num.toString();
    });
  }

  addText(text: string) {
    this.tasks.push(() => {
      this.context += text;
      return Promise.resolve();
    });
    return this;
  }

  removeText(text: string) {
    this.tasks.push(() => {
      this.context = this.context.replace(text, "");
      return Promise.resolve();
    });
    return this;
  }

  async toNumber() {
    await this.runTasks();
    return Number(this.context);
  }

  private async runTasks() {
    for (const task of this.tasks) {
      await task();
    }
  }
}

const run = async () => {
  const value = await AsyncBuilder.fromNumber(123)
    .addText("456")
    .removeText("3")
    .toNumber();

  console.log(value);
};

run();

