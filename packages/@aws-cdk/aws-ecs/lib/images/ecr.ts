import * as ecr from '@aws-cdk/aws-ecr';
import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';

/**
 * An image from an Amazon ECR repository.
 */
export class EcrImage extends ContainerImage {
  /**
   * The image name. Images in Amazon ECR repositories can be specified by either using the full registry/repository:tag or
   * registry/repository@digest.
   *
   * For example, 012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>:latest or
   * 012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>@sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE.
   */
  public readonly imageName: string;
  private noGrant: boolean | undefined;

  /**
   * Constructs a new instance of the EcrImage class.
   */
  constructor(private readonly repository: ecr.IRepository, private readonly tag: string, noGrant?: boolean) {
    super();

    this.noGrant = noGrant;
    this.imageName = this.repository.repositoryUriForTag(this.tag);
  }

  public bind(_scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
    if (!this.noGrant) {
      this.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
    }

    return {
      imageName: this.imageName
    };
  }
}
