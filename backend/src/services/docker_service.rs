use bollard::Docker;
use bollard::container::{ListContainersOptions, Config, CreateContainerOptions, StartContainerOptions, LogOutput};
use bollard::image::ListImagesOptions;
use bollard::network::ListNetworksOptions;
use bollard::volume::ListVolumesOptions;
use futures::StreamExt;
use std::collections::HashMap;
use anyhow::Result;

pub struct DockerService {
    client: Docker,
}

impl DockerService {
    pub fn new() -> Result<Self> {
        // Connect with defaults (handles unix/windows automatically)
        let client = Docker::connect_with_defaults()?;
        Ok(Self { client })
    }

    // --- Container Methods ---

    pub async fn list_containers(&self, all: bool) -> Result<Vec<bollard::service::ContainerSummary>> {
        let options = Some(ListContainersOptions::<String> {
            all,
            ..Default::default()
        });
        let containers = self.client.list_containers(options).await?;
        Ok(containers)
    }

    pub async fn start_container(&self, id: &str) -> Result<()> {
        self.client.start_container(id, None::<StartContainerOptions<String>>).await?;
        Ok(())
    }

    pub async fn stop_container(&self, id: &str) -> Result<()> {
        self.client.stop_container(id, None).await?;
        Ok(())
    }

    pub async fn restart_container(&self, id: &str) -> Result<()> {
        self.client.restart_container(id, None).await?;
        Ok(())
    }

    pub async fn remove_container(&self, id: &str) -> Result<()> {
        self.client.remove_container(id, None).await?;
        Ok(())
    }

    pub async fn get_container_logs(&self, id: &str) -> Result<impl futures::Stream<Item = Result<LogOutput, bollard::errors::Error>>> {
        let options = Some(bollard::container::LogsOptions {
            stdout: true,
            stderr: true,
            follow: true,
            tail: "100".to_string(),
            ..Default::default()
        });
        Ok(self.client.logs(id, options))
    }

    pub async fn inspect_container(&self, id: &str) -> Result<bollard::service::ContainerInspectResponse> {
        let container = self.client.inspect_container(id, None).await?;
        Ok(container)
    }

    // --- Image Methods ---

    pub async fn list_images(&self) -> Result<Vec<bollard::service::ImageSummary>> {
        let images = self.client.list_images(Some(ListImagesOptions::<String>::default())).await?;
        Ok(images)
    }

    pub async fn pull_image(&self, image: &str) -> Result<()> {
        let mut stream = self.client.create_image(
            Some(bollard::image::CreateImageOptions {
                from_image: image.to_string(),
                ..Default::default()
            }),
            None,
            None,
        );
        while let Some(item) = stream.next().await {
            item?;
        }
        Ok(())
    }

    // --- Network Methods ---
    pub async fn list_networks(&self) -> Result<Vec<bollard::service::Network>> {
        let networks = self.client.list_networks(Some(ListNetworksOptions::<String>::default())).await?;
        Ok(networks)
    }

    // --- Volume Methods ---
    pub async fn list_volumes(&self) -> Result<Vec<bollard::service::Volume>> {
        let volumes = self.client.list_volumes(Some(ListVolumesOptions::<String>::default())).await?;
        Ok(volumes.volumes.unwrap_or_default())
    }
}
