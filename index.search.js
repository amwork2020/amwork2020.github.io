var relearn_search_index = [
  {
    "content": "date: 2023-02-04\nVMWARE 加网卡 (192.168.68.56 8c 8G)\nhttps://www.dpdk.org/\nhttp://doc.dpdk.org/guides-22.11/\n编辑对应的 jammy.vmx，修改所有e1000为vmxnet3 ，多队列网卡 ethernet0.virtualDev = \"vmxnet3\" ethernet0.wakeOnPcktRcv = \"true\" ... ethernet1.virtualDev = \"vmxnet3\" ethernet1.wakeOnPcktRcv = \"true\" ethernet2.virtualDev = \"vmxnet3\" ethernet2.wakeOnPcktRcv = \"true\" lshw -c network -businfo root@jammy:~# ip a ... 2: ens192: \u003cBROADCAST,MULTICAST,UP,LOWER_UP\u003e mtu 1500 qdisc mq state UP group default qlen 1000 link/ether 00:0c:29:9f:04:74 brd ff:ff:ff:ff:ff:ff altname enp11s0 inet 192.168.68.56/24 brd 192.168.68.255 scope global ens192 valid_lft forever preferred_lft forever inet6 fe80::20c:29ff:fe9f:474/64 scope link valid_lft forever preferred_lft forever 3: ens224: \u003cBROADCAST,MULTICAST\u003e mtu 1500 qdisc noop state DOWN group default qlen 1000 link/ether 00:0c:29:9f:04:7e brd ff:ff:ff:ff:ff:ff altname enp19s0 4: ens256: \u003cBROADCAST,MULTICAST\u003e mtu 1500 qdisc noop state DOWN group default qlen 1000 link/ether 00:0c:29:9f:04:88 brd ff:ff:ff:ff:ff:ff altname enp27s0 apt install dpdk dpdk-dev -y vi /etc/default/grub GRUB_CMDLINE_LINUX=\"default_hugepagesz=1G hugepagesz=1G hugepages=4 iommu=pt intel_iommu=on\" #GRUB_CMDLINE_LINUX=\"default_hugepagesz=1G hugepagesz=1G hugepages=4 isolcpus=2-3 iommu=pt intel_iommu=on\" update-grub # grub2-mkconfig -o /boot/grub2/grub.cfg reboot ## dmesg | grep -e DMAR -e IOMMU cat /proc/cmdline | grep -e iommu=pt -e intel_iommu=on -e huge dmesg| grep -i iommu cat /proc/meminfo | grep Huge lscpu | grep NUMA dpdk-hugepages.py -s dpdk-devbind.py -s lshw -businfo -c network root@dpdk56:~# lshw -businfo -c network Bus info Device Class Description ==================================================== pci@0000:0b:00.0 ens192 network VMXNET3 Ethernet Controller pci@0000:13:00.0 ens224 network VMXNET3 Ethernet Controller pci@0000:1b:00.0 ens256 network VMXNET3 Ethernet Controller dmesg| grep -i iommu | grep -e 0000:0b:00.0 -e 0000:13:00.0 -e 0000:1b:00.0 root@dpdk56:~# dmesg| grep -i iommu | grep -e 0000:0b:00.0 -e 0000:13:00.0 -e 0000:1b:00.0 [ 2.723136] pci 0000:0b:00.0: Adding to iommu group 6 [ 2.723277] pci 0000:13:00.0: Adding to iommu group 7 [ 2.723432] pci 0000:1b:00.0: Adding to iommu group 8 root@jammy:~ # dpdk-devbind.py -s Network devices using kernel driver =================================== 0000:0b:00.0 'VMXNET3 Ethernet Controller 07b0' if=ens192 drv=vmxnet3 unused=vfio-pci *Active* 0000:13:00.0 'VMXNET3 Ethernet Controller 07b0' if=ens224 drv=vmxnet3 unused=vfio-pci 0000:1b:00.0 'VMXNET3 Ethernet Controller 07b0' if=ens256 drv=vmxnet3 unused=vfio-pci dpdk-devbind.py -b vfio-pci 0000:13:00.0 0000:1b:00.0 # dpdk-devbind.py -b vfio-pci 0000:13:00.0 # dpdk-devbind.py -b vfio-pci 0000:1b:00.0 dpdk-devbind.py -s Network devices using DPDK-compatible driver ============================================ 0000:13:00.0 'VMXNET3 Ethernet Controller 07b0' drv=vfio-pci unused=vmxnet3 0000:1b:00.0 'VMXNET3 Ethernet Controller 07b0' drv=vfio-pci unused=vmxnet3 Network devices using kernel driver =================================== 0000:0b:00.0 'VMXNET3 Ethernet Controller 07b0' if=ens192 drv=vmxnet3 unused=vfio-pci *Active* dpdk-hugepages.py -s root@jammy:~ # dpdk-hugepages.py -s Node Pages Size Total 0 4 1Gb 4Gb Hugepages mounted on /dev/hugepages ### build pkten export https_proxy=http://10.1.1.12:8118 wget https://github.com/pktgen/Pktgen-DPDK/archive/refs/tags/pktgen-22.07.1.tar.gz tar zxvf pktgen-22.07.1.tar.gz cd Pktgen-DPDK-pktgen-22.07.1 meson build cd build ninja 编译完毕后的pkten在[Pktgen dir]/build/app/pktgen ## 源码BUILD dpdk apt install -y build-essential ## pip3 install meson ninja apt install meson python3-pyelftools pkg-config libnuma-dev export http_proxy=http://10.1.1.12:8118 wget http://fast.dpdk.org/rel/dpdk-22.11.1.tar.xz tar Jxvf dpdk-22.11.1.tar.xz cd dpdk-stable-22.11.1 meson setup -Dexamples=all build cd build ninja # ninja install ### 因为 apt install dpdk dpdk-dev -y ./pktgen -l 1-3 -n 2 -- -T -P -m \"2.0,3.1\" -l: 使用CPU Cores 1、2、3 -n: 内存通道 --：此符号前是DPDK的配置参数，此符号后是DPDK Application的配置参数，此处即是Pktgen的参数 -T: 启用彩色文本输出 -P: Enable PROMISCUOUS mode on all ports -m string: 重点！指定cpu core与NIC的绑定关系，格式参照下图： ",
    "description": "",
    "tags": null,
    "title": "1. vmware-dpdk",
    "uri": "/dpdk/1.vmware-dpdk/index.html"
  },
  {
    "content": "",
    "description": "",
    "tags": null,
    "title": "amwork2010 blog",
    "uri": "/index.html"
  },
  {
    "content": "",
    "description": "",
    "tags": null,
    "title": "Categories",
    "uri": "/categories/index.html"
  },
  {
    "content": "",
    "description": "",
    "tags": null,
    "title": "dpdk",
    "uri": "/categories/dpdk/index.html"
  },
  {
    "content": "",
    "description": "",
    "tags": null,
    "title": "DPDKs",
    "uri": "/dpdk/index.html"
  },
  {
    "content": "",
    "description": "",
    "tags": null,
    "title": "Tags",
    "uri": "/tags/index.html"
  }
]
