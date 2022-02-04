import React from "react";

const Menu = () => {
  return (
    <div>
      <div className={classes.menuContainer}>
        <span style={{ fontWeight: "600" }} className={classes.menu_header}>
          Menu
        </span>
        {party.menus && (
          <>
            <div
              className={`${classes.cat_flex} ${
                darkMode ? classes.darkCatFlex : ""
              }`}
            >
              {categories.map((cg) => {
                return (
                  <div
                    key={cg.id}
                    className={current === cg.params ? classes.active : ""}
                    onClick={() => {
                      setCurrent(cg.params);
                      if (cg.params === "all") {
                        setDefaultMenus(typeMenu);
                      } else {
                        filterMenu(cg.params);
                      }
                    }}
                  >
                    {cg.label}
                  </div>
                );
              })}
            </div>

            <div className={classes.search}>
              <TextField
                disabled={
                  party.menus &&
                  party.menus.length < 1 &&
                  defaultMenus.length < 1
                }
                value={search}
                onChange={async (e) => {
                  await setSearch(e.target.value);
                  searchFilter(e.target.value);
                }}
                type="search"
                placeholder="Search Menu"
                fullWidth
                size="small"
              />
            </div>
          </>
        )}
        {party.menus && party.menus.length > 0 && defaultMenus.length > 0 ? (
          <div
            className={`${classes._container} ${
              darkMode ? classes.darkContainer : ""
            }`}
          >
            {defaultMenus.map((menu) => {
              return (
                <div className={classes.menu} key={menu.id}>
                  <Avatar
                    src={menu.menu_img}
                    sx={{
                      height: 100,
                      width: 100,
                      borderRadius: "6px",
                      boxShadow: "0 0 15px rgb(0 0 0 /2%)",
                    }}
                  />
                  <div className={classes.menu_details}>
                    <div className={classes.detail_flex}>
                      <span
                        style={
                          menu.name.length > 9
                            ? {
                                fontSize: "10px",
                              }
                            : { fontWeight: "600" }
                        }
                        className={classes.menu_name}
                      >
                        {menu.name}
                      </span>
                      <span className={classes.menu_price}>{menu.price}</span>

                      {/* <span className={classes.menu_category}>
                            {menu.category.label}
                          </span> */}
                      {menu.type && (
                        <span
                          className={`${classes.menu_type} ${
                            menu.type.value === "regular"
                              ? classes.regular
                              : menu.type.value === "vip"
                              ? classes.vip
                              : classes.vvip
                          }`}
                        >
                          <div className={classes.type_icon}>
                            {menu.type.value === "regular" ? (
                              <BsStarFill />
                            ) : menu.type.value === "vip" ? (
                              <RiVipCrown2Fill />
                            ) : (
                              <RiVipDiamondFill />
                            )}
                          </div>
                          {menu.type.label}
                        </span>
                      )}
                    </div>
                    <Box display="flex" gap="10px" flexDirection="column">
                      <Box display="flex" gap="4px">
                        <button
                          onClick={() => {
                            const update = defaultMenus.map((item) =>
                              item.id === menu.id
                                ? {
                                    ...item,
                                    quantity:
                                      item.quantity > 1
                                        ? parseInt(item.quantity) - 1
                                        : (item.quantity = 1),
                                  }
                                : item
                            );
                            const alert = defaultMenus.find(
                              (m) => m.id === menu.id
                            );
                            setDefaultMenus(update);
                            if (alert.quantity === 1) {
                              toast.info(
                                "Minimum quantity for current menu is 1"
                              );
                            }
                          }}
                        >
                          &lt;
                        </button>
                        <input
                          type="number"
                          min="0"
                          className={classes.q_input}
                          value={menu.quantity}
                          onChange={(e) => {
                            const update = defaultMenus.map((item) =>
                              item.id === menu.id
                                ? {
                                    ...item,
                                    quantity: e.target.value,
                                  }
                                : item
                            );

                            if (
                              e.target.value === "0" ||
                              parseInt(e.target.value) < 1
                            ) {
                              toast.info(
                                "Minimum quantity for current menu is 1"
                              );
                              defaultMenus.map((item) =>
                                item.id === menu.id
                                  ? {
                                      ...item,
                                      quantity: 0,
                                    }
                                  : item
                              );
                            } else {
                              setDefaultMenus(update);
                            }
                            // console.log(parseInt("000099"));
                          }}
                        />
                        <button
                          onClick={() => {
                            console.log(reserved);
                            const update = defaultMenus.map((item) =>
                              item.id === menu.id
                                ? {
                                    ...item,
                                    quantity: parseInt(item.quantity) + 1,
                                  }
                                : item
                            );

                            setDefaultMenus(update);
                          }}
                        >
                          &gt;
                        </button>
                      </Box>
                      <Button
                        onClick={() => {
                          const find = reserved.find((r) => r.id === menu.id);
                          if (find) {
                            const update = reserved.map((item) =>
                              item.id === menu.id
                                ? {
                                    ...item,
                                    quantity: menu.quantity,
                                  }
                                : item
                            );
                            setReserved(update);
                          } else {
                            setReserved([...reserved, menu]);
                          }

                          toast.success(
                            `${menu.quantity} ${menu.name} added to ${menu.type.label} reservation`
                          );
                        }}
                        variant="contained"
                        color="primary"
                        style={{
                          padding: "10px 20px !important",
                          fontSize: "0.9rem",
                          lineHeight: "3",
                          minWidth: "30px",
                        }}
                        disabled={
                          menu.quantity === "0" ||
                          menu.quantity === 0 ||
                          !menu.quantity
                        }
                        size="small"
                      >
                        Add
                      </Button>
                    </Box>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={classes.no_menu}>
            <img src="/add.png" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
