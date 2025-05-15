export class NetworkConfiguration {
  constructor(
    public name: string,
    public fullNodeUrl: string,
    public contract: string,
    public faucetUrl: string
  ) {}
}
