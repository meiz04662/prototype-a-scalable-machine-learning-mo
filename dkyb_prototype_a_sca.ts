interface IData {
  features: Array<number>;
  label: number;
}

interface IModel {
  train(data:IData[]): void;
  predict(features: Array<number>): number;
  evaluate(data:IData[]): number;
}

class DKYBPrototypeASca {
  private models: IModel[] = [];

  constructor(private numModels: number, private modelFactory: () => IModel) {}

  addData(data: IData[]) {
    for (let i = 0; i < this.numModels; i++) {
      this.models[i].train(data);
    }
  }

  addModel() {
    this.models.push(this.modelFactory());
  }

  predict(features: Array<number>) {
    let predictions: number[] = [];
    for (let i = 0; i < this.numModels; i++) {
      predictions.push(this.models[i].predict(features));
    }
    return predictions;
  }

  evaluate(data: IData[]) {
    let evaluations: number[] = [];
    for (let i = 0; i < this.numModels; i++) {
      evaluations.push(this.models[i].evaluate(data));
    }
    return evaluations;
  }
}

interface IAPI {
  postCreateController(numModels: number, modelFactory: () => IModel): DKYBPrototypeASca;
  postAddData(controllerId: string, data: IData[]): void;
  postAddModel(controllerId: string): void;
  postPredict(controllerId: string, features: Array<number>): number[];
  postEvaluate(controllerId: string, data: IData[]): number[];
}

class API implements IAPI {
  private controllers: { [id: string]: DKYBPrototypeASca } = {};

  postCreateController(numModels: number, modelFactory: () => IModel) {
    const controller = new DKYBPrototypeASca(numModels, modelFactory);
    const id = `controller-${Object.keys(this.controllers).length + 1}`;
    this.controllers[id] = controller;
    return id;
  }

  postAddData(controllerId: string, data: IData[]) {
    if (this.controllers[controllerId]) {
      this.controllers[controllerId].addData(data);
    } else {
      throw new Error(`Controller with id ${controllerId} not found`);
    }
  }

  postAddModel(controllerId: string) {
    if (this.controllers[controllerId]) {
      this.controllers[controllerId].addModel();
    } else {
      throw new Error(`Controller with id ${controllerId} not found`);
    }
  }

  postPredict(controllerId: string, features: Array<number>) {
    if (this.controllers[controllerId]) {
      return this.controllers[controllerId].predict(features);
    } else {
      throw new Error(`Controller with id ${controllerId} not found`);
    }
  }

  postEvaluate(controllerId: string, data: IData[]) {
    if (this.controllers[controllerId]) {
      return this.controllers[controllerId].evaluate(data);
    } else {
      throw new Error(`Controller with id ${controllerId} not found`);
    }
  }
}

export default API;