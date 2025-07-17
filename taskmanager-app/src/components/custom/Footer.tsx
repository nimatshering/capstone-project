import Link from "next/link";

export const Footer = () => {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },

    {
      title: "Product",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "Reports",
          href: "/reports",
        },
        {
          title: "Dashboards",
          href: "/dashboards",
        },
      ],
    },
    {
      title: "Task Manger",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "About us",
          href: "/about",
        },
        {
          title: "Contact us",
          href: "/contact",
        },
      ],
    },
  ];

  return (
    <div className="w-full py-20 lg:py-40 text-gray-700 bg-stone-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Title and Description */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight leading-tight text-left max-w-xl">
              Task Manager
            </h2>
            <p className="text-lg leading-relaxed text-left text-gray-600 max-w-lg">
              Simplify your business...
            </p>
          </div>

          {/* Right Column: Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="space-y-2 text-base font-medium text-left"
              >
                {item.items?.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.href}
                    className="block hover:underline hover:text-gray-900 transition"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
