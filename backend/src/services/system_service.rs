use sysinfo::{System, SystemExt, CpuExt, NetworkExt, DiskExt};
use std::sync::{Arc, Mutex};
use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct SystemStats {
    pub cpu_usage: f32,
    pub memory_total: u64,
    pub memory_used: u64,
    pub disks: Vec<DiskInfo>,
    pub networks: Vec<NetworkInfo>,
    pub os_name: String,
    pub os_version: String,
    pub kernel_version: String,
    pub uptime: u64,
}

#[derive(Serialize, Clone)]
pub struct DiskInfo {
    pub name: String,
    pub mount_point: String,
    pub total_space: u64,
    pub available_space: u64,
}

#[derive(Serialize, Clone)]
pub struct NetworkInfo {
    pub interface: String,
    pub received: u64,
    pub transmitted: u64,
}

pub struct SystemService {
    sys: Arc<Mutex<System>>,
}

impl SystemService {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self {
            sys: Arc::new(Mutex::new(sys)),
        }
    }

    pub fn get_stats(&self) -> SystemStats {
        let mut sys = self.sys.lock().unwrap();
        sys.refresh_all();

        let cpu_usage = sys.global_cpu_info().cpu_usage();
        let memory_total = sys.total_memory();
        let memory_used = sys.used_memory();
        let uptime = sys.uptime();
        let os_name = sys.name().unwrap_or_default();
        let os_version = sys.os_version().unwrap_or_default();
        let kernel_version = sys.kernel_version().unwrap_or_default();

        let disks = sys.disks().iter().map(|d| DiskInfo {
            name: format!("{:?}", d.name()),
            mount_point: d.mount_point().to_string_lossy().to_string(),
            total_space: d.total_space(),
            available_space: d.available_space(),
        }).collect();

        let networks = sys.networks().iter().map(|(name, data)| NetworkInfo {
            interface: name.clone(),
            received: data.received(),
            transmitted: data.transmitted(),
        }).collect();

        SystemStats {
            cpu_usage,
            memory_total,
            memory_used,
            disks,
            networks,
            os_name,
            os_version,
            kernel_version,
            uptime,
        }
    }
}
