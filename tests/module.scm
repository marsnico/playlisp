(module
  (print "importing module.scm")
  (export add
    (lambda (a b)
      (+ a b)
    )
  )
  (export sub
    (lambda (a b)
      (- a b)
    )
  )
  (export hello
    (lambda (name)
      (print "hello," name)
    )
  )
)
