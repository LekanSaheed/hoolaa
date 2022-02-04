 <Box
        padding="10px"
        className={`${classes.container} ${darkMode ? classes.darkCont : ""}`}
      >
        {notFound && (
          <div className={classes.notFound}>
            <Box padding="10px" textAlign="center">
              Party might have been deleted or does not exist.
            </Box>
            <img src="/notfound.png" />
          </div>
        )}
        {Object.entries(party).length > 0 && (
          <>
            <div className={classes.partyGroup}>
              <img
                className={classes.cover_img}
                src={party.cover_img}
                // style={{ height: "200px", width: "50%", borderRadius: "6px" }}
              />

              <Box
                padding="10px"
                gap="20px"
                display="flex"
                marginTop="-60px"
                flexDirection="column"
                className={`${classes.party_details} ${
                  darkMode ? classes.dark_party_details : ""
                }`}
              >
                <Box display="flex" gap="10px">
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    src={party.creator.displayPics && party.creator.displayPics}
                  >
                    {!party.creator.displayPics &&
                      party.creator.username.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box display="flex" flexDirection="column" gap="10px">
                    <span className={classes.party_name}>
                      {party.partyName}
                    </span>
                    <span className={classes.username}>
                      {" "}
                      @{party.creator.username}
                    </span>
                  </Box>
                </Box>
                <div className={classes.date_time}>
                  <div className={classes.date_time_container}>
                    <div className={classes._date}>
                      {" "}
                      <span className={classes.month}>
                        {moment(party.start_date.toDate()).format("MMM")}
                      </span>
                      <span className={classes.day}>
                        {moment(party.start_date.toDate()).format("DD")}
                      </span>
                    </div>
                    <div className={classes._time}>
                      <span className={classes.titular_day}>
                        {" "}
                        {moment(party.start_date.toDate()).format("dddd")}
                      </span>
                      <span style={{ fontSize: "11px", color: "#fff1ff97" }}>
                        {" "}
                        {moment(party.start_date.toDate()).format("hh:mm a")} -
                        End
                      </span>
                    </div>
                  </div>
                  <div className={classes.date_action}>Add</div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    padding: "20px 15px",
                    borderRadius: "20px",
                  }}
                >
                  <span
                    style={{
                      color: "#f68b64",
                      fontWeight: "600",
                    }}
                  >
                    Who is coming
                  </span>
                  <Box
                    padding="20px 0px"
                    display="flex"
                    gap="10px"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                  </Box>
                </div>
                <Box display="flex" gap="20px">
                  <div className={classes._people_box}>
                    <span>Total attending</span>
                    <span>249</span>
                  </div>
                  <div className={classes._people_box}></div>
                </Box>
                <Box display="flex" alignItems="center" gap="0px">
                  <span className={classes.icon}>
                    {" "}
                    <HiUsers />
                  </span>
                  {party.reservers ? party.reservers.length : "0"} People
                  attending
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  {" "}
                  <span className={classes.icon}>
                    <MdCategory />
                  </span>
                  <span
                    className={classes.details}
                    style={{ fontWeight: "600" }}
                  >
                    {" "}
                    {party.category.label}
                  </span>
                </Box>

                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <BsCalendarWeekFill />
                  </span>
                  <span
                    className={classes.details}
                    style={{ fontWeight: "600" }}
                  >
                    {moment(party.start_date.toDate()).format(
                      "ddd, MMM DD YYYY hh:mm:a"
                    )}
                  </span>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <HiLocationMarker />
                  </span>
                  <span
                    style={{ fontWeight: "600" }}
                  >{`${party.location.street}, ${party.location.city} ${party.location.state}`}</span>
                </Box>
              </Box>
            </div>
            {party.isStarted && !party.isEnded ? (
              <Box
                onClick={() =>
                  router.push({
                    pathname: router.pathname + "/party-space",
                    query: { ...router.query },
                  })
                }
              >
                CHECK IN
              </Box>
            ) : party.isStarted && party.isEnded ? (
              "This party has ended"
            ) : (
              <div>
                <div
                  className={`${classes.proposed_modal} ${
                    isToggled ? classes.expandModal : classes.shrinkModal
                  }`}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    className={classes.menu_layout}
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Box fontSize="28px" fontWeight="800">
                        Menus
                      </Box>{" "}
                      <Box fontSize="18px" fontWeight="600">
                        {reserved
                          .filter((r) => {
                            console.log(r);
                            return r.type.value === selected.value;
                          })
                          .reduce((a, b) => a + b.quantity, 0) + " items"}
                      </Box>
                    </Box>

                    <Box display="flex" flexDirection="column">
                      <label>Select a category</label>
                      <Select
                        options={options}
                        value={selected}
                        onChange={handleCategorySelect}
                      />{" "}
                      {selected && (
                        <div className={classes.flex_list}>
                          {/* Menu Should be here */}
                          {/* Reserved Menus */}
                        </div>
                      )}
                    </Box>
                  </Box>
                  <div className={classes.reserved}>
                    {/* Reserved Menu */}
                    <Box
                      textAlign="center"
                      fontWeight="600"
                      borderBottom="solid 1px #bababa"
                      paddingBottom="10px"
                    >
                      {" "}
                      {selected.label}
                    </Box>
                    <Box
                      paddingTop="10px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="100%"
                    >
                      <Box display="flex" flexDirection="column" gap="15px">
                        {reserved.length > 0 &&
                          reserved
                            .filter((r) => r.type.value === selected.value)
                            .map((r) => {
                              return (
                                <motion.div
                                  key={r.id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <Avatar
                                    variant="rounded"
                                    sx={{ height: 30, width: 30 }}
                                    src={r.menu_img}
                                  />
                                  <Box>
                                    {r.name}
                                    {r.quantity}
                                  </Box>
                                  <Button
                                    onClick={() =>
                                      setReserved(
                                        reserved.filter((rs) => rs.id !== r.id)
                                      )
                                    }
                                  >
                                    <HiTrash />
                                  </Button>
                                </motion.div>
                              );
                            })}
                      </Box>
                      <Box>
                        <Box display="flex" justifyContent="space-between">
                          <span>Total</span> <span>{2000}</span>
                        </Box>
                        <Button
                          fullWidth
                          color="primary"
                          variant="contained"
                          style={{
                            background: "#8800ff",
                            // position: "absolute",
                            // bottom: "3px",
                            padding: "10px",
                          }}
                          onClick={() => {
                            reserve();
                            // makeReservation();
                          }}
                        >
                          Make Reservation
                        </Button>
                      </Box>
                    </Box>
                  </div>
                </div>
                Proposed Modal Ui
              </div>
            )}
          </>
        )}
      </Box>
