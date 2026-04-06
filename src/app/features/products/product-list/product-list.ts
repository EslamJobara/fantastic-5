import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent {
  products = [
    {
      name: 'Lumina Pro 14"',
      badge: 'Laptops',
      price: '1,299',
      desc: 'M3 Chip • 16GB RAM • 512GB SSD',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRGDwtLxL-NgFDB5ZY819ZISRgEDdT41rM74tpxv61bJ-kGuuSMQCVhONzD39c55sp3KR4um69MgMkkIZq3pZlEvOIfPHKM91HKi036T0H7uNcbK12t9_mXW9ORQqjMDEB8PVoC_H9KuymxJzhHC7MRYZPRQXCYNTEDGI--b9U5x6lStGplhoiKfnNCu4ZXAQQ8FfwrZii1HOfpel2lOVoMqaNDDywXpLM4-ZOW0rjtF-xwMI_Wp8iz6ETQhMGq0hmNdlH7phmu1rU'
    },
    {
      name: 'Acoustic S1 Wireless',
      badge: 'Audio',
      price: '349',
      desc: 'Active Noise Canceling • 40H Battery',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClnnMDJ7ahHNcrONhxVynHcWYCP_sTity5znvSHX9sNjW_J1rAHzzazxyrN_R56gRq4ZGpnlYtETUhaHzOnU3GDiGEhAbRnIfkxnVFEcEysXmxHojEamcr96JZ10Sa9i4FouxN9hvFgFay9EY-AOqMIMsTwqXGfoWm0kVmXXpqVcJArnKqEmyWS2binP6yM0payEcNXT9hrdE9RT6CdoQi8oAVXXMSyh8cYEpRcjZuBnXYQVhtPL10zdyyDZxOOcike5MKRnCw8pBD'
    },
    {
      name: 'Chronos Gen 5',
      badge: 'Wearables',
      price: '499',
      desc: 'OLED Display • Heart Rate Sensor',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWcCrzVEzLJrTst1L08ttWkJ96Vp_pBDnMAuThMtDZBcmSpLDxK4kFoAkFoqwbYVPy3r8qwE5HgGp_Yw0NSRG7zgtIv_XUPRWHYA0B95TLqhkjtiJTfhKX82Ao9JUy_dScmQTluJT--RNPIULmwCk6u0m0FhDlv1UBFzgBlZtj-0tgS8zm2I5DQssUe2jwLqiHxnsjeL-MAugIyQ4POMppH-qXl2Eu8rK1M2GPH3ZNwHgtmYIxAaJHjNocWM_GmzQuzM53qdrEUNlh'
    },
    {
      name: 'Tactile Mechanical K1',
      badge: 'Accessories',
      price: '189',
      desc: 'Hot-Swappable • RGB • Aluminum Base',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmO7IJiRPU6c3Uc1vZy-r8Tryo8G9o5c1BcUyXhTbcYa0Q8DNtKsNUpWcSk-Ej1hkuHphOcze9_TGn0D-0AePxTM49R3aM6_ZqyZDX2xGYksgCdaKrZ9We_3z5MFb4E-r16jb5Cklxhg_Il4zTrwWHZklY_rNwKiqPRkDkqYAQ99iIjkNSn2ezUjLtevS7y4lxk1m9qaikF3uWScLmtQtlI4jRQ9zXFbAYNo7jRkQ3m0Opf3QUJ4YP37pSgOQSQ0AgbcDqb57M-zJy'
    },
    {
      name: 'Slate Pro 12.9',
      badge: 'Tablets',
      price: '1,099',
      desc: 'Liquid Retina • Pencil Support',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdnmBLSSY9CgMeaijUQk8TvnjXG3OaPCucvMqmruiHEJjdL8Pul_bbRQixEg56NFuGj06S8Sh5wGmDi6cOjO3lQtlXBJQPTEsaxoYqHqAMEml3ClJsOb2ZPmDrpPUXKT-E08ZVsAhoc6V8lmjs6_Aizz_f1hw9cw_O-voLameT2dQ3T6d33znJZesKbBUTSXVmD_fByWrlp5adlEyLG0ppJinrxwCnRF7MBN_E9_WHEIecfKUH8uKeLWmU_21DRkDeY1jrfm98DBr0'
    },
    {
      name: 'Precision Mouse Gen 2',
      badge: 'Accessories',
      price: '129',
      desc: '8000 DPI • Silent Clicks • Multi-Device',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsJVUqZWPyxactILpkLH3NdfZMAHY4TRpc0-0OdF18cXvcm0vBPK5r7d5GfcTvRsGEVaQhbx6uDLUBNP66MCPMlqhv3hXXXu1ub6fjPCpLqXYiks3ZDkyCq3WO_g_p5Zg0vCijcutfXToTsys8forToKABI8ciTOl_7of1_fIa6mhdSsq9Gr9r0-6RDlOX_bhaHDdzwECimyLZ6z-z1aTNaRXdtSY-zjCIPwtvlHYgdH9G4hwWsTgig1mooPawaE39q1uLy4sguld0'
    },
    {
      name: 'Sonic Core H1',
      badge: 'Audio',
      price: '299',
      desc: 'Hi-Res Audio • Bluetooth 5.2',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbeAJudCI_leJOIZxm1oAs-wV5dItSnIEXq4Mvk4eM9TkXoNdC1R03dMePb1T-Z21Ckttk_FADxaCi8vQ9F5eECAXvdAYNvr7bqtLi_0UR5OlsW2zDwm02GGZCBazauiNTaeBWFIptBHdWCb7SXY0j1WBEZXKntOmkuKg2IH12QAsjQ6B2KBsNSlrOu4avkQljS-d6eD6c5xytZ_3H2Ycyt2U3jeFHeSNBQnj1S0nQlL5uWN9klqsJUTEIpCKmU3-AkaIDkvK_8Xid'
    },
    {
      name: 'Vortex Pro PC',
      badge: 'Gaming',
      price: '2,499',
      desc: 'RTX 4080 • i9-14900K • 32GB RAM',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY_aJ0Rg9zMZa9IPucmgf0Ox3jYll5jgDxMT-UOZpnYVIk19v3pohJIoVNZSO-LyXMD4XIyy14tQP4rlq5AZY5gbVAFxQWvxK-cXDbr_8H0iq5Qgc21xWscxkwpqi_Jsvg3cGGfO7pYaElX10rwYodGupagg6Sjui5uhWa52n1VXbbMzWVBjBpOjC8qGvAU4wX3jAbZdKq3PkGMxksYd96h9HixPepWCuFwFIteCQ8FCyQxioDGaUZZjKQUMtdonntO1jnMHCKGLMV'
    },
    {
      name: 'Visionary X-100',
      badge: 'Cameras',
      price: '1,599',
      desc: '45MP Sensor • 8K Video • IBIS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlvbxwLP2qyLQ28jOpCW77o_luhZTGivdXg_L9uRJgSuZVDbpIi8nDoskrmFiQhMNNKsxSKGAo8ncjuEYhyU_PC_WCB6lcuUBYQP-lT46bzUNqmia26OrLvPp1UaonCMFSLe23M6CHEEQqRwiuRTAMCnccJt_2S9H0EbWo4ecEPGTkKAXcgxgrVTWfe5JAU3iPsoufNUrqe8qXogqRHjBWPiVtO5G5r9IbHQSMptzdjC5b4H4S1wO3cEQP6hzSMdubvYEUVUR__iNH'
    }
  ];

  handleAddToCart(product: any) {
    console.log('Add to cart:', product);
    // Add your cart logic here
  }

  handleViewDetails(product: any) {
    console.log('View details:', product);
    // Navigate to product details
  }

  handleSearch(query: string) {
    console.log('Search query:', query);
    // Add your search/filter logic here
  }
}
