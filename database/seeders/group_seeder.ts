import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Group from '../../app/modules/CMS/Admin/models/group.js'
import Permission from '../../app/modules/CMS/Admin/models/permission.js'
import User from '../../app/modules/CMS/Admin/models/user.js'
import Category from '../../app/modules/CMS/Websites/models/category.js'
import Product from '../../app/modules/CMS/Websites/models/product.js'
import ProductVariant from '../../app/modules/CMS/Websites/models/product_variant.js'
import Brand from '../../app/modules/CMS/Websites/models/brand.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await Group.createMany([
      { name: 'Superadmin', description: 'Superuser' },
      { name: 'Admin', description: 'admin' },
      { name: 'Customers', description: 'customers' },
    ])

    await Permission.createMany([
      //
      { name: 'dashboard-dashboard-view', description: 'dashboard view'},
      { name: 'websites-websites-view', description: 'website view'},
      { name: 'admin-admin-view', description: 'admin view'},
      //
      { name: 'websites-pages-view', description: 'pages view'},
      { name: 'websites-pages-index', description: 'pages index'},
      { name: 'websites-pages-add', description: 'pages add'},
      { name: 'websites-pages-edit', description: 'pages edit'},
      { name: 'websites-pages-delete', description: 'pages delete'},
      //
      { name: 'admin-groups-view', description: 'groups view'},
      { name: 'admin-groups-index', description: 'groups index'},
      { name: 'admin-groups-add', description: 'groups add'},
      { name: 'admin-groups-edit', description: 'groups edit'},
      { name: 'admin-groups-delete', description: 'groups delete'},
      //
      { name: 'admin-users-view', description: 'users view'},
      { name: 'admin-users-index', description: 'users index'},
      { name: 'admin-users-add', description: 'users add'},
      { name: 'admin-users-edit', description: 'users edit'},
      { name: 'admin-users-delete', description: 'users delete'},
      { name: 'admin-permissions-edit', description: 'permission edit'},
      //
      { name: 'websites-categories-view', description: 'categories view'},
      { name: 'websites-categories-index', description: 'categories index'},
      { name: 'websites-categories-add', description: 'categories add'},
      { name: 'websites-categories-edit', description: 'categories edit'},
      { name: 'websites-categories-delete', description: 'categories delete'},
      //
      { name: 'websites-products-view', description: 'products view'},
      { name: 'websites-products-index', description: 'products index'},
      { name: 'websites-products-add', description: 'products add'},
      { name: 'websites-products-edit', description: 'products edit'},
      { name: 'websites-products-delete', description: 'products delete'},
      //
      { name: 'websites-brands-view', description: 'brands view'},
      { name: 'websites-brands-index', description: 'brands index'},
      { name: 'websites-brands-add', description: 'brands add'},
      { name: 'websites-brands-edit', description: 'brands edit'},
      { name: 'websites-brands-delete', description: 'brands delete'},
      //
    ])

    await User.create({
      lastname: 'admin',
      firstname: 'super',
      email: 'superadmin@noreply.com',
      address: 'Admin Address',
      password: 'password1234'
    })

    const group = await Group.findBy('name','Superadmin')
    await group?.related('permissions').sync(Array.from({ length: 34}, (_, index) => index + 1))
    await group?.related('users').sync([1])

    await Category.createMany([
      { name: 'Smartphones', description: 'smartphone', status: 'active' },
      { name: 'Tablets', description: 'tablets', status: 'active' },
    ])

    await Brand.createMany([
      { name: 'Samsung', description: 'samsung', status: 'active' },
      { name: 'Google', description: 'google', status: 'active' },
      { name: 'Infinix', description: 'infinix', status: 'active' },
    ])

    await Product.createMany([
      { name: 'Galaxy S23', modelNumber: 'SM-S928BZTQPHL', content: '<p>The Samsung Galaxy S23 is a flagship smartphone that combines a sleek design with cutting-edge technology. Featuring a powerful Snapdragon 8 Gen 2 processor and a vibrant Dynamic AMOLED display, it excels in performance and visual quality.</p>', status: 'publish', categoryId: 1, brandId: 1},
      { name: 'Pixel 7', modelNumber: 'SM-J810FZKGMID', content: '<p>The Google Pixel 7 offers an outstanding photography experience, powered by Googles advanced computational photography technology. With its bright OLED display and the Google Tensor G2 chip, it ensures smooth performance and smart features.</p>', status: 'publish', categoryId: 1, brandId: 2},
      { name: 'Infinix Zero X Pro', modelNumber: 'X6820', content: '<p>The Infinix Zero X Pro combines a premium design with powerful features, including an impressive camera system perfect for capturing stunning photos.</p>', status: 'publish', categoryId: 1, brandId: 3},
      { name: 'Infinix Note 10', modelNumber: 'X693', content: '<p>The Infinix Note 10 is designed for those who love entertainment on the go. Its large 6.95-inch display with a 90Hz refresh rate ensures a fluid experience for gaming and streaming. The robust 5000 mAh battery guarantees extended usage, while the versatile camera setup allows for creative photography.</p>', status: 'publish', categoryId: 1, brandId: 3},
      { name: 'Infinix Hot 10', modelNumber: 'X682C', content: '<p>The Infinix Hot 10 is a budget-friendly smartphone that offers impressive features for everyday use. With its large 6.78-inch display and a powerful 5200 mAh battery, it provides a great user experience for browsing, social media, and light gaming. The versatile camera setup captures decent photos for casual photography.</p>', status: 'publish', categoryId: 1, brandId: 3},
    ])

    await ProductVariant.createMany([
      { feature: `<ul>
        <li><strong>Display:</strong> 6.1-inch Dynamic AMOLED 2X, 1080 x 2340 pixels</li>
        <li><strong>Processor:</strong> Snapdragon 8 Gen 2</li>
        <li><strong>RAM:</strong> 8GB</li>
        <li><strong>Camera:</strong>
        <ul>
        <li>Rear: Triple (50MP wide, 12MP ultra-wide, 10MP telephoto)</li>
        <li>Front: 12MP</li>
        </ul>
        </li>
        <li><strong>Battery:</strong> 3,900mAh with fast charging</li>
        <li><strong>Operating System:</strong> Android 13, One UI 5.1</li>
        <li><strong>Water Resistance:</strong> IP68</li>
        </ul>`, storage: '8GB/128GB', color: 'Green', stock: '10', image: '/uploads/2024/9/13/zhoukb9jeugv1byr2kit3jeq.png', sku: 'SG23-PB-128', price: 70000, productId: 1
      },
      { feature: `<ul>
        <li><strong>Display:</strong> 6.1-inch Dynamic AMOLED 2X, 1080 x 2340 pixels</li>
        <li><strong>Processor:</strong> Snapdragon 8 Gen 2</li>
        <li><strong>RAM:</strong> 8GB</li>
        <li><strong>Camera:</strong>
        <ul>
        <li>Rear: Triple (50MP wide, 12MP ultra-wide, 10MP telephoto)</li>
        <li>Front: 12MP</li>
        </ul>
        </li>
        <li><strong>Battery:</strong> 3,900mAh with fast charging</li>
        <li><strong>Operating System:</strong> Android 13, One UI 5.1</li>
        <li><strong>Water Resistance:</strong> IP68</li>
        </ul>`, storage: '8GB/128GB', color: 'Cream', stock: '11', image: '/uploads/2024/9/13/cupgvrvvvtgy15l5xmcgnm3q.png', sku: 'SG23-CR-256', price: 70000, productId: 1
      },
      { feature: `<ul>
        <li><strong>Display:</strong> 6.3-inch OLED, 1080 x 2400 pixels</li>
        <li><strong>Processor:</strong> Google Tensor G2</li>
        <li><strong>RAM:</strong> 8GB</li>
        <li><strong>Camera:</strong>
        <ul>
        <li>Rear: Dual (50MP wide, 12MP ultra-wide)</li>
        <li>Front: 10.8MP</li>
        </ul>
        </li>
        <li><strong>Battery:</strong> 4,355mAh with fast and wireless charging</li>
        <li><strong>Operating System:</strong> Android 13</li>
        <li><strong>Water Resistance:</strong> IP68</li>
        </ul>`, storage: '8GB/128GB', color: 'Snow', stock: '11', image: '/uploads/2024/9/13/ebqpuj3zdkiv0uv1ry0kb5ol.jpg', sku: 'GP7-OB-128', price: 60000, productId: 2
      },
      { feature: `<p><strong>Specifications</strong>:</p>
        <ul>
        <li><strong>Display</strong>: 6.67 inches, AMOLED, 120Hz</li>
        <li><strong>Processor</strong>: MediaTek Helio G95</li>
        <li><strong>Camera</strong>: 108 MP (main), 8 MP (ultrawide), 2 MP (depth)</li>
        <li>&nbsp;</li>
        </ul>`, storage: '128GB/256GB', color: 'Nebula Black', stock: '11', image: '/uploads/2024/9/16/lijckmu2bg8ahnhyesdb9epr.jpg', sku: 'X6820', price: 17999, productId: 3
      },
      { feature: `<p><strong>Specifications</strong>:</p>
        <ul>
        <li><strong>Display</strong>: 6.95 inches, IPS LCD, 90Hz</li>
        <li><strong>Processor</strong>: MediaTek Helio G85</li>
        <li><strong>Camera</strong>: 48 MP (main), 2 MP (macro), 2 MP (depth)</li>
        <li><strong>Battery</strong>: 5000 mAh, 18W fast charging</li>
        </ul>`, storage: '64GB/128GB', color: 'Black', stock: '11', image: '/uploads/2024/9/16/x485ke2chmma5riokw54ghp1.jpg', sku: 'X693', price: 8999, productId: 4
      },
      { feature: `<p><strong>Specifications</strong>:</p>
        <ul>
        <li><strong>Display</strong>: 6.95 inches, IPS LCD, 90Hz</li>
        <li><strong>Processor</strong>: MediaTek Helio G85</li>
        <li><strong>Camera</strong>: 48 MP (main), 2 MP (macro), 2 MP (depth)</li>
        <li><strong>Battery</strong>: 5000 mAh, 18W fast charging</li>
        </ul>`, storage: '64GB/128GB', color: 'Ocean Wave', stock: '11', image: '/uploads/2024/9/16/p5pq24394w9h9p4gs9emezk5.jpg', sku: 'X682C', price: 6999, productId: 5
      },
    ])
  }
}